# ElevenLabs — narração THCProce (API servidor)

Infraestrutura para gerar áudio com a voz oficial do professor **sem expor a API Key no navegador**.

## Variáveis de ambiente

| Variável | Onde | Descrição |
|----------|------|-----------|
| `ELEVENLABS_API_KEY` | **Só servidor** (nunca `NEXT_PUBLIC_*`) | Chave da conta ElevenLabs |
| `ELEVENLABS_VOICE_ID` | Servidor | Identificador da voz (ex.: voz oficial THCProce) |
| `ELEVENLABS_MODEL_ID` | Servidor (opcional) | Modelo TTS; se omitido usa `eleven_multilingual_v2` |
| `NEXT_PUBLIC_CAMPUS_VOICE_TEST_PANEL` | Build/client | `"true"` para mostrar o painel de teste em `/admin/voice-test` e o link **Voz (teste)** no header admin |

Configure em desenvolvimento no `.env` local e em produção no dashboard da Vercel (**Settings → Environment Variables**).

## Segurança

- **Nunca** uses `NEXT_PUBLIC_ELEVENLABS_API_KEY`. Qualquer variável com prefixo `NEXT_PUBLIC_` é embutida no bundle do browser e ficaria pública.
- A rota `POST /api/voice/tts` valida **sessão NextAuth** e **e-mail em** `NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS` (mesmo critério que o resto do `/admin`). Alunos sem perfil admin recebem 401/403 mesmo que descubram o URL.
- Rotacione a chave na ElevenLabs se foi exposta (commits, chats, screenshots).

## Ativar / desativar o painel de teste

1. Defina `NEXT_PUBLIC_CAMPUS_VOICE_TEST_PANEL=true` no ambiente desejado.
2. Faça novo deploy (variáveis `NEXT_PUBLIC_*` são fixadas em build time).
3. Inicie sessão como administrador do campus e abra `/admin/voice-test`.

Para **desativar**, remova a variável ou defina qualquer valor diferente de `"true"` e volte a fazer deploy.

## Implementação no código

- Biblioteca: `src/lib/voice/elevenlabs.ts` — `generateElevenLabsSpeech(text)`
- API: `src/app/api/voice/tts/route.ts`
- UI de teste: `src/components/campus/CampusVoiceTestPanel.tsx`

Limite de texto: **1200 caracteres** (validado na rota e truncado de forma defensiva na biblioteca).

## Testar com curl (sessão admin)

O endpoint espera cookies de sessão (mesmo domínio que o browser após login). Para um smoke test rápido em local, depois de autenticado pode usar cookies exportados ou testar só pela UI admin.

Exemplo genérico (substitua pela sua origem e garanta que o cookie de sessão está incluído se CSRF/cookies forem exigidos):

```bash
curl -X POST http://localhost:3000/api/voice/tts \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Olá, meus amigos. Bem-vindos ao THCProce Campus.\"}" \
  --output teste-thcproce.mp3
```

Sem sessão admin válida, a API responde JSON `401` ou `403`, não MP3.

## Próximos passos (não incluídos nesta fase)

- NPCs, intro cinematográfica e narração automática de aulas continuam por ligar a esta API quando o produto decidir.
