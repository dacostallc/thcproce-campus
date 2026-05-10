# Registo técnico — overlays e frames do Campus (`/campus`)

Documento de auditoria do estado actual do código (Next.js / `CampusMap.tsx` + `HUD.tsx`).  
Serve para **não misturar** semanticamente: cinema ao vivo, player de media ambiente, presença/peers, hotspots do mapa, HUD e ferramentas de debug.

**Nota sobre z-index:** valores só são comparáveis dentro do **mesmo stacking context**. O palco do mapa (`#campus-map-stage` com `isolate`) cria contexto próprio; elementos **`position: fixed`** ligados ao viewport competem entre si à raiz da página. Quando dois overlays `fixed` partilham o mesmo z, a ordem no DOM pode desempatar.

---

## A) Media / cinema / player

| Componente (ficheiro) | Tipo | Responsabilidade | Estado / stores | z-index (principal) | Pointer-events | Persistência | Visual |
|----------------------|------|------------------|-----------------|---------------------|----------------|--------------|--------|
| **`CineDriveIn`** (`components/CineDriveIn.tsx`) | cinema · modal · viewport overlay | Player grande **drive-in** (YouTube/HLS/Mux/Bunny), chat placeholder, espectadores aproximados | `useCampusStore`: `isCineOpen`, `cinemaSeatIndex`, `cinemaAuditoriumFull`; `useCampusPresenceStore` para contagem | Raíz ~**40** (backdrop stack); painel interactivo **41**; decorações 25–38 | Misto: outer `none`, backdrop + card **auto** | Nenhuma (estado sessão no store; mundo local via `CampusWorldPersistenceSync`) | **fixed**, centrado topo |
| **`CampusMapCinemaLiveFloatingFrame`** (interno em `CampusMapInteractiveMapPanels.tsx`) | cinema · HUD · draggable · overlay | Painel «Cinema e ao vivo» no mapa (zona `campus-cinema`); pré-visualização MP4 opcional via `CampusCinemaHudPreview` e CDN (`resolveCampusCinemaVideoSrc`). | `useCampusHudStore`: `campusMapCinemaLiveOpen`, `campusMapCinemaLiveExpanded` | **`CINEMA_LIVE_FRAME_Z` = 54** (`style.zIndex`) | **auto** no cartão | **localStorage** `thcproce.campus.cinemaLiveHudDockPosition.v1` (x,y) — chave dedicada (≠ player ambiente) | **fixed** + Framer drag; dock inferior **esquerda** (<960px) ou **centrado** (≥960px) por defeito |
| **`CampusHudAmbientMusic`** (`CampusHudAmbientMusic.tsx`) | HUD · player · draggable · overlay | Playlist **ambiente / rádio / cinema** (áudio), não é vídeo do drive-in | Local state + `read/writeHudAmbient*`; `read/writeCampusMediaPlayerPosition` | **`PLAYER_Z` = 51** | Misto: shell **auto**, drag handle | **localStorage** (volume, mute, track, autoplay intent, posição) | **fixed**, draggable |
| **`CampusCineHotspot`** (`CampusCineHotspot.tsx`) | hotspot · cinema anchor | Zona clicável **telão** no mapa para sentar / abrir drive-in; não é um “frame” flutuante | `useCampusStore`: seats, `openCineDriveIn` / walk timer | Camada **z-[14]** sobre arte | Área do telão **auto**, resto **none** | Parcialmente via fluxo sentar + sync mundo | **absolute** no espaço do mapa |

**Dependências:** `CampusMap` monta `CampusCineHotspot` + `CineDriveIn`; mapa simples monta `CampusMapInteractiveMapPanels` (cinema live HUD). `HUD` monta `CampusHudAmbientMusic`.

---

## B) Presença / alunos / peers

| Componente | Tipo | Responsabilidade | Estado / stores | z-index | Pointer-events | Persistência | Visual |
|------------|------|------------------|-----------------|---------|----------------|--------------|--------|
| **`CampusPresenceSync`** | — | Sincroniza canal realtime **sem UI** | Supabase + `campusPresenceStore` | — | — | Backend / canal | — |
| **`CampusSelfPresenceSync`** | — | Estado **próprio** aluno (idle/walking/cinema…) | `useCampusSelfPresenceStore`, `campusStore`, pathname | — | — | Mistura local + heartbeat | — |
| **`CampusMapPeerLayer`** | peer · composição | Escolhe fonte: realtime TTL → social poll → mock visitante | `campusPresenceStore`, `campusStore`, props TRPC | — | — | — | Delega para filhos |
| **`CampusUnifiedPresencePeers`** | peer · overlay | Renderiza **orbs** dos outros alunos no mapa | Props `items` + `realtimeByPeerId` | Dentro do pai **z-[12]** stack | **none** no recipiente mapa | Via payloads realtime | **absolute** % mapa |
| **`CampusAvatarIdTag`** (peer) | peer · label | Nome/nível sobre orb peer (`viewer="peer"`) | — | Relativo ao orb | **none** típico | — | world-space |
| **`CampusSocialPresenceDots`** (`presence/CampusSocialPresenceDots.tsx`) | HUD · presence · overlay | Bolinhas **conta/social** (polling BD), não são coords do mapa nem micro-hotspots | TRPC `campusSocialPoll`, sessão | **z-[9]** *dentro* do clip z-[7] | **none** | Backend (poll) | **absolute** sobre arte |
| **`CampusPresencePanel`** | HUD · painel | Lista presença + métricas + preferências sociais | Props `presenceBreakdown`, TRPC | Embutido no dropdown HUD (**z-[60]** menu Overflow vs painel presença **z-25** stack à esquerda — ver HUD) | **auto** quando aberto | Backend parcial + local prefs | fixed / motion |

**Self avatar:** **`CampusPlayer`** — “eu” no mapa (**z-[11]** dentro do wrapper **z-[12]**); usa `useCampusStore` (`player`, `avatarPosture`, `isCineOpen`, emojis cinema). **Não** é peer.

---

## C) Hotspots / mapa interactivo

| Componente | Tipo | Responsabilidade | Estado / stores | z-index | Pointer-events | Persistência | Visual |
|------------|------|------------------|-----------------|---------|----------------|--------------|--------|
| **`CampusMapInteractiveLayer`** | hotspot · overlay · SVG | Polígonos image-map, marcadores glow, diálogos tópico, rotas HUD store/mural/cinema **rail** | `campusHudStore`, `campusStore`, router; props `zonesDebugChrome`, `cinemaLiveActive` | Empilhado em **z-[8]** do ramo simples | **auto** no SVG (salvo supressão cine) | Hit persistence via callback `onPersistInteractiveActivation` | **absolute** full stage |
| **`CampusInteractiveHotspotMarker`** (interno) | hotspot · decoração SVG | Bolinha + anel por área interactiva | — | Relativo ao `<g>` | Marcador **none**, hit no **polygon** | — | world-space |
| **`CampusMicroHotspotDecorLayer`** | hotspot · decoração | Micro labels **PRAGA / TRICOMAS / PH / CLONE / FREEZE** + pontos | Lista constante `CAMPUS_MICRO_HOTSPOTS` | Contentor **z-[10]** | **none** (hover só CSS grupo) | Nenhuma | **absolute** |
| **`CampusSemanticMapOverlay`** | hotspot · modal interno | Overlay semântico opcional (`ENABLE_SEMANTIC_MAP_OVERLAY`) | `campusHudStore`, seleccionados curso | **z-[9]** absoluto no stage | Misto | — | **absolute** |
| **`Hotspot`** (`Hotspot.tsx`) | hotspot · legacy HTML | Pins âmbar legacy — **desactivado** no `/campus` público | — | **z-10** quando preview interno | **none** no wrapper | — | absolute % |
| **`Cannabis101StartBeacon`** | hotspot · callout | Balão “começa aqui” Cannabis 101 | Props + handlers | **z-[13]** | **none** / foco grupo | — | absolute |
| **`CampusFogZonesLayer`** + **`ZoneTooltip`** | zona · hotspot · tooltip | Mapa avançado: zonas nomeadas + tooltip hover | `unlockCtx`, progress | Dentro **z-[8]** ramo advanced | **auto** paths zona | — | SVG %-space |
| **`MapWalkLayer`** | navegação | Clique para caminhar | `setPlayer` | **z-[8]** advanced | **auto** | — | absolute |
| **`CampusSimpleMapLayer`** | navegação | Cliques genéricos mapa simples | — | **z-[8]** | — | — | absolute |

---

## D) HUD geral (chrome global)

| Componente | Tipo | Responsabilidade | Estado / stores | z-index | Pointer-events | Persistência | Visual |
|------------|------|------------------|-----------------|---------|----------------|--------------|--------|
| **`HUD`** (`HUD.tsx`) | HUD · compositor | Header fixo, menus, modais loja/perfil/missions, chat shortcut | `campusHudStore`, `campusSkyStore`, `campusStore`, sessão | Header **z-20**; dropdowns **z-[60]**; nav móvel **z-[40]**; vários modais **55–60** | Misto `pointer-events-none` + filhos **auto** | Variado (TRPC, LS perfil local) | **fixed** |
| **`CampusHudAmbientMusic`** | (ver secção A) | — | — | **51** | — | — | — |
| **`ProximityBanner`** | HUD · toast | Sugestão “quase no hotspot” | Props locais `CampusMap` | **z-[35]** | **auto** | — | **fixed** |
| **`CampusVivoLayer`** | HUD · chip | Chip “Campus vivo” totais | Props presence breakdown | Dentro **z-[7]** | **none** | — | absolute sobre arte |
| **`StudentRewardToast`** | HUD · toast | Recompensas XP | — | **z-[70]** | **none** | — | **fixed** |
| **`MissionRewardToast`** | HUD · toast | Missões | — | **z-[72]** | **none** | — | **fixed** |
| **`LiveHudNotifications`** | HUD · stack avisos | Notificações live admin-friendly | `liveCampusHudFeedStore` | **z-[21]** | **none**/filhos | — | **fixed** |
| **`CampusMap`** — canto inferior (**ShoppingBag** + **`CampusStartHereCard`**) | HUD · atalhos | Loja + cartão “Comece aqui” embed | `campusHudStore`, missions telemetry | **z-[28]** wrapper **none**, botões **auto** | Misto | — | **fixed** |
| **`CoursePanel`** | modal · painel curso | Painel lateral curso | Selecção `CampusMap` | backdrop **z-30**, painel **z-40** | **auto** | — | **fixed** |
| **`LessonPanel`** | modal · aula | Aula fullscreen / drawer mobile | `campusHudStore.campusLessonPanelOpen`, etc. | **44–47** camadas | **auto** | — | **fixed** |
| **`CampusChatDrawer`** | modal · drawer | Chat lateral | `campusHudStore.chatOpen` | overlay **45**, drawer **50** | **auto** | — | **fixed** |
| **`CampusAdminBroadcastLayer`** | HUD · overlay admin | Balões broadcast sobre mapa | Admin + payload | **z-[44]** container **none** | Filhos conforme | — | **fixed** |
| **`CampusMapInteractiveMapPanels`** | HUD · painéis mapa | Programação (slide left), **cinema live** float, mural centro | `campusHudStore` | Schedule backdrop **51**, aside **52**; mural **51/52** | **auto** nos painéis | Cinema: LS posição | **fixed** |
| **`CampusMapHotspotPanel`** | modal · aside | Ficha leitura hotspot TRPC | `campusMapHotspotPanelHitId` | slide aside (~**52** pattern) | **auto** | — | **fixed** |
| **`CampusGuestNicknameModal`** | modal | Nick visitante | Estado local HUD | **55 / 60** | **auto** | **localStorage** visitor nick | **fixed** |
| **`CampusStoreModal`** | modal | Loja | `campusStoreOpen` | **54 / 58** | **auto** | — | **fixed** |
| **`InternalPreviewBanner`** | debug · banner | Aviso preview interno | — | **z-[60]** | Misto | — | **fixed** |

---

## E) Debug / ferramentas

| Componente | Tipo | Responsabilidade | Estado / stores | z-index | Pointer-events | Persistência | Visual |
|------------|------|------------------|-----------------|---------|----------------|--------------|--------|
| **`CampusMapAreasDebugOverlay`** | debug · overlay SVG | Polígonos catálogo áreas (`mapZones` %) | `catalogMergeEnabled` prop + LS opcional | **z-[6]** no stage | **none** | LS opcional `CAMPUS_MAP_AREAS_OVERLAY_LS_KEY` | absolute |
| **`CampusMapInteractiveLayer`** + classe `--debug` | debug · overlay técnico | Outline image-map + labels ids quando `zonesDebugChrome` | Query `debugZones` / não-prod | Herda stack interactivo | Hit faces podem passar a `presentation` em debug | — | — |
| **`CampusWalkableLayer`** com `NEXT_PUBLIC_CAMPUS_DEBUG` | debug | Mostra malha passeável | env | **z-[5]** | **none** (prod); **auto** paths em debug | — | absolute |
| **`CampusMapCustomCursor`** | UX · cursor | Cursor custom avançado | — | **z-[50]** fixed | **none** | — | **fixed** |

---

## Árvore de montagem (ordem relevante em `CampusMap.tsx`)

Ordem simplificada **depois** dos syncs:

1. **Palco** `absolute inset-0 z-[1]` → `#campus-map-stage` **isolate**
   - Arte / vignette / profundidade (z 2–7)
   - Opcional **`CampusMapAreasDebugOverlay`** (z ~6)
   - **`CampusWalkableLayer`** (z 5), **`CampusBiomeOverlays`**
   - **`AmbientLife`**, **`CampusAmbientSparks`**, **`CampusVivoLayer`**, **`CampusSocialPresenceDots`** (clip z 7)
   - Ledges cinematográficos (z 7)
   - **Advanced:** `MapWalkLayer`, **`CampusFogZonesLayer`**, **`CampusMapCustomCursor`**
   - **Simple:** `CampusSimpleMapLayer`, **`CampusMapInteractiveLayer`**, opcional **`CampusSemanticMapOverlay`**
   - Legacy **`Hotspot`** list (z 10, normalmente vazio)
   - **`Cannabis101StartBeacon`** (z 13)
   - **`CampusCineHotspot`** (z 14)
   - **`CampusMicroHotspotDecorLayer`** (z 10 contentor)
   - **`CampusPlayer`** + **`CampusMapPeerLayer`** (contentor z 12)

2. Fora do palco (irmãos do wrapper z1): tour, welcome, **`ProximityBanner`**, **`CineDriveIn`**, admin composers/layers, **`HUD`**, **`CampusMapInteractiveMapPanels`**, canto fixo z 28.

---

## Dependências cruzadas (resumo)

- **`CampusMap`** orquestra palco + painéis + `CineDriveIn` + `HUD`.
- **`HUD`** inclui **audio player** + vários modais e não conhece peers no mapa directamente.
- **`CampusMapInteractiveLayer`** abre **cinema live HUD** via `setCampusMapCinemaLiveOpen` — **distinto** de **`CineDriveIn`** (`isCineOpen`).
- **`CampusMapPeerLayer`** → **`CampusUnifiedPresencePeers`** — só peers; não usar nomes “frame cinema”.
- **`CampusMicroHotspotDecorLayer`** é só decoração editorial; hits reais estão em **`CampusMapInteractiveLayer`**.

---

## Proposta de nomenclatura futura (opcional)

| Actual | Nome sugerido (para código futuro) |
|--------|-------------------------------------|
| `CineDriveIn` | `CampusCinemaDriveInStage` ou `CampusLiveStreamStageModal` |
| Painel cinema em `CampusMapInteractiveMapPanels` | `CampusCinemaLiveMapCard` (draggable) |
| `CampusHudAmbientMusic` | `CampusHudAmbientAudioDock` |
| `CampusPlayer` | `CampusLocalAvatarLayer` |
| `CampusMapPeerLayer` | `CampusRealtimePeersComposer` |
| `CampusUnifiedPresencePeers` | `CampusPeerOrbsLayer` |
| `CampusMicroHotspotDecorLayer` | `CampusEditorialMicroMarkersLayer` |
| `CampusInteractiveHotspotMarker` | `CampusImageMapHotspotGlyph` |

---

## Checklist rápido para novas features

- Cinema **vídeo fullscreen** → `CineDriveIn` + `campusStore.isCineOpen`.
- Cinema **cartão flutuante lista/live** → `campusHudStore.campusMapCinemaLive*` + `CampusMapInteractiveMapPanels`.
- **Som ambiente** → `CampusHudAmbientMusic` apenas.
- **Outros alunos no mapa** → `CampusMapPeerLayer` / `CampusUnifiedPresencePeers`; não misturar com HUD cinema.
- **Hits pedagógicos** → `CampusMapInteractiveLayer` (+ micro decor à parte).

Última revisão: gerado a partir da estrutura do repo `thcproce-campus` (Next 14).
