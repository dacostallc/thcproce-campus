"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Radio, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { trpc } from "@/lib/trpc/react";

type Props = {
  isCampusAdmin: boolean;
};

export function CampusLiveAdminComposer({ isCampusAdmin }: Props) {
  const open = useCampusHudStore((s) => s.campusLiveComposerOpen);
  const setOpen = useCampusHudStore((s) => s.setCampusLiveComposerOpen);
  const utils = trpc.useUtils();

  const { data: live, isFetching } = trpc.campus.liveBroadcast.useQuery(undefined, {
    enabled: isCampusAdmin,
    staleTime: 8_000,
    refetchInterval: open ? 12_000 : false
  });

  const [liveActive, setLiveActive] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isCampusAdmin && open) setOpen(false);
  }, [isCampusAdmin, open, setOpen]);

  useEffect(() => {
    if (!open || !live) return;
    setLiveActive(live.liveActive);
    setYoutubeUrl(live.youtubeUrl);
    setErr(null);
  }, [open, live]);

  const save = trpc.campus.adminSetLiveBroadcast.useMutation({
    onSuccess: async (data) => {
      utils.campus.liveBroadcast.setData(undefined, data);
      setErr(null);
      setOpen(false);
    },
    onError: (e) => {
      setErr(e.message ?? "Erro ao gravar.");
    }
  });

  if (!isCampusAdmin) return null;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[46] bg-black/25 backdrop-blur-[1px] pointer-events-auto"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Configurar live do Cine THCProce"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed bottom-6 left-1/2 z-[48] w-[min(94vw,480px)] -translate-x-1/2 rounded-2xl border border-emerald-400/40 bg-black/78 p-3 shadow-[0_18px_56px_rgba(0,0,0,0.55),0_0_28px_rgba(52,211,153,0.14)] pointer-events-auto backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-100">
                <Radio size={18} className="text-emerald-300" aria-hidden />
                <div>
                  <p className="text-sm font-bold leading-tight">Live do campus</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/60">
                    Produção: use{" "}
                    <code className="rounded bg-white/10 px-1 py-px font-mono text-[10px]">
                      NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE
                    </code>{" "}
                    e{" "}
                    <code className="rounded bg-white/10 px-1 py-px font-mono text-[10px]">
                      NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL
                    </code>{" "}
                    na Vercel. Aqui só pré-visualiza nesta sessão. Atalho:{" "}
                    <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">
                      Shift
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">
                      L
                    </kbd>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-emerald-400/50 text-emerald-500 focus:ring-emerald-400/40"
                checked={liveActive}
                onChange={(e) => setLiveActive(e.target.checked)}
              />
              <span className="text-sm text-white/90">Live no ar (pulso no mapa + regras de acesso)</span>
            </label>

            <label className="mt-3 block">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
                Link YouTube (live ou playlist)
              </span>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=… ou /live/…"
                className="mt-1.5 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-emerald-400/45 focus:outline-none focus:ring-2 focus:ring-emerald-400/25"
                autoComplete="off"
              />
              <p className="mt-1 text-[10px] text-white/45">
                Deixe em branco para voltar ao link definido nas variáveis de ambiente do deploy.
              </p>
            </label>

            {err ? (
              <p className="mt-2 text-[11px] font-medium text-red-300/95" role="alert">
                {err}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="glass" size="sm" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-emerald-600/85 hover:bg-emerald-500/90"
                disabled={save.isPending || isFetching}
                onClick={() =>
                  save.mutate({
                    liveActive,
                    youtubeUrl
                  })
                }
              >
                {save.isPending ? "A gravar…" : "Guardar"}
              </Button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
