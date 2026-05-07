# Moodle Web Services — checklist THCProce campus

Este app consome REST em [`src/lib/moodle/ws.ts`](../src/lib/moodle/ws.ts). Sem token, usa mocks alinhados à grade em `src/data/courses.ts`.

## 1. Ativar protocolo

1. Admin Moodle → **Advanced features** → marque **Enable web services**.
2. **Site administration → Server → Manage protocols** → habilite **REST**.

## 2. Criar serviço

1. **External services → Add** → nome ex. `campus_frontend`.
2. Adicione funções:

   - `core_enrol_get_users_courses`
   - `core_completion_get_course_completion_status`

3. Opcional futuro SSO: token de usuário ou plugin OAuth.

## 3. Gerar token de serviço

1. Crie usuário técnico (ex. `ws_campus`) com permissões de leitura adequadas ou use administrador apenas em sandbox.
2. **Create token** para esse usuário no serviço externo criado.

## 4. Variáveis de ambiente (.env local / Vercel)

```
MOODLE_WS_TOKEN=xxxxxxxx
NEXT_PUBLIC_MOODLE_BASE_URL=https://seudominio.com.br/moodle   # ou /escola conforme instalção
MOODLE_MOCK_USER_ID=123   # userid Moodle para testes de enrolled + completion (obrigatório se token só de usuário)
# JSON opcional slug → moodle course id (prioridade sobre 100 + índice em dev)
MOODLE_COURSE_MAP={"cannabis-101":12,"medicina":34}
```

## 5. Auditar IDs dos cursos (≥11 disciplinas PROCBD)

Os hotspots usam **`shortname`/slug interno** em `courses.ts`. No Moodle anote **`course.id`** por curso:

| Slug hotspot (`courses.ts`) | Moodle `shortname` (sug.) | Moodle `courseid` |
| --------------------------- | ------------------------- | ------------------ |
| `cannabis-101`              | *preencher*               | *preencher*        |
| `cultivo-greenhouse`        |                           |                    |
| `cultivo-outdoor`           |                           |                    |
| `cultivo-indoor`            |                           |                    |
| `genetica`                  |                           |                    |
| `secagem-cura`              |                           |                    |
| `extracoes-solventless`     |                           |                    |
| `extracao-oleo`             |                           |                    |
| `medicina`                  |                           |                    |
| `culinaria`                 |                           |                    |
| `laboratorio`               |                           |                    |
| `legislacao`                |                           |                    |
| `cooperativismo`            |                           |                    |
| `industria`                 |                           |                    |

**Mapeamento no código:** preencher `MOODLE_COURSE_MAP` (JSON — ver env acima); o servidor usa [`src/lib/moodle/courseMap.ts`](../src/lib/moodle/courseMap.ts) e cai para `100 + índice` apenas onde não houver slug.

## 6. SSO com NextAuth / Auth.js (implementado de forma opcional)

O campus mantém **credenciais de dev** e adiciona provedor **OAuth `moodle`** quando as variáveis abaixo existem. A função que monta o provider está em [`src/lib/auth/moodleOAuth.ts`](../src/lib/auth/moodleOAuth.ts).

Dois modos:

1. **OpenID Discovery:** defina `MOODLE_OIDC_DISCOVERY_URL` (URL completa) **ou** apenas `MOODLE_OIDC_ISSUER` — o app tenta `{issuer}/.well-known/openid-configuration`.
2. **Endpoints manuais:** `MOODLE_OAUTH_AUTHORIZATION_URL`, `MOODLE_OAUTH_TOKEN_URL`, `MOODLE_OAUTH_USERINFO_URL` (+ `MOODLE_OAUTH_CLIENT_ID` e `MOODLE_OAUTH_CLIENT_SECRET`).

Opcional: `MOODLE_OAUTH_SCOPES` (padrão `openid email profile`).  
Em produção defina `NEXT_PUBLIC_SHOW_MOODLE_LOGIN=true` para exibir o botão **Entrar com Moodle** em `/entrar`.

O Moodle “puro” nem sempre expõe servidor OIDC; costuma-se usar **plugin OAuth2 server**, **Keycloak** ligado ao mesmo domínio ou outro IdP que já autentique os alunos — o front só precisa das URLs de discovery ou dos três endpoints OAuth2.

## 7. Vídeo Bunny com token (embed assinado)

Com **Token authentication** ativado na Video Library, defina **apenas no servidor** `BUNNY_STREAM_TOKEN_AUTH_KEY` (chave do painel Bunny) e opcionalmente `BUNNY_STREAM_LIBRARY_ID`. O front chama `campus.bunnyEmbedUrl` (usuário logado) e recebe a URL do iframe com `token` + `expires`. Ver [`src/lib/bunny/signedEmbed.ts`](../src/lib/bunny/signedEmbed.ts).

