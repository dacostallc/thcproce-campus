/**
 * Faz upload dos MP3s locais para o Supabase Storage e atualiza as URLs no banco.
 *
 * Pré-requisitos no .env:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY=service_role_key_aqui
 *
 * Uso: node scripts/upload-audio-supabase.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, "utf8");
    for (let line of raw.split(/\r?\n/)) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
    break;
  }
}

async function main() {
  loadDotEnv();

  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey   = process.env.SUPABASE_SERVICE_KEY?.trim();

  if (!supabaseUrl || !serviceKey) {
    console.error("❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_KEY no .env");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const { PrismaClient }  = await import("@prisma/client");

  const sb = createClient(supabaseUrl, serviceKey);
  const db = new PrismaClient();
  const BUCKET = "lesson-audio";

  // Garante que o bucket existe
  const { error: bucketErr } = await sb.storage.createBucket(BUCKET, { public: true }).catch(() => ({ error: null }));
  if (bucketErr && !bucketErr.message?.includes("already exists")) {
    console.warn("Aviso bucket:", bucketErr.message);
  }

  // Procura todos os MP3s em public/audio (suporte a layouts antigo e novo)
  const audioDirs = [
    path.join(ROOT, "public", "audio", "lessons"),
    path.join(ROOT, "public", "audio"),
  ];

  const mp3Files = [];
  for (const dir of audioDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const courseDir of fs.readdirSync(dir)) {
      const full = path.join(dir, courseDir);
      if (!fs.statSync(full).isDirectory()) continue;
      for (const file of fs.readdirSync(full)) {
        if (!file.endsWith(".mp3")) continue;
        mp3Files.push({
          localPath: path.join(full, file),
          courseId: courseDir,
          lessonId: file.replace(".mp3", ""),
          objectPath: `${courseDir}/${file}`,
        });
      }
    }
  }

  // Remove duplicatas por objectPath (prefere o da pasta nova)
  const seen = new Set();
  const unique = mp3Files.filter(f => {
    if (seen.has(f.objectPath)) return false;
    seen.add(f.objectPath);
    return true;
  });

  console.log(`\n📤 ${unique.length} arquivo(s) MP3 encontrado(s)\n`);

  let uploaded = 0;
  let skipped  = 0;
  let errors   = 0;

  for (const { localPath, courseId, lessonId, objectPath } of unique) {
    const buffer = fs.readFileSync(localPath);

    const { error } = await sb.storage
      .from(BUCKET)
      .upload(objectPath, buffer, { contentType: "audio/mpeg", upsert: true });

    if (error) {
      console.error(`❌ ${objectPath}: ${error.message}`);
      errors++;
      continue;
    }

    const publicUrl = sb.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;

    // Atualiza ou cria registro no DB
    await db.lessonAudio.upsert({
      where: { courseId_lessonId: { courseId, lessonId } },
      create: { courseId, lessonId, audioUrl: publicUrl, sizeBytes: buffer.length },
      update: { audioUrl: publicUrl, sizeBytes: buffer.length },
    });

    console.log(`✅ ${objectPath} → ${publicUrl.slice(0, 70)}…`);
    uploaded++;
  }

  await db.$disconnect();

  console.log(`\n=== RESUMO ===`);
  console.log(`✅ Enviados:  ${uploaded}`);
  console.log(`⏩ Pulados:   ${skipped}`);
  console.log(`❌ Erros:     ${errors}`);
  console.log(`\nAgora os players vão usar as URLs do Supabase em produção.`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
