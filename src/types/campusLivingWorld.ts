/**
 * Arquitectura futura — “mundo vivo” do campus (sem runtime pesado nesta fase).
 * Contratos estáveis para dia/noite, clima, eventos e NPCs.
 */

export type CampusLivingCyclePhase = "dawn" | "day" | "dusk" | "night";

export type CampusWeatherPreset = "clear" | "rain" | "mist" | "heatwave";

export type CampusRadioStationId = "ambient" | "campus_fm" | "off";

export type CampusWorldEventKind =
  | "cinema_premiere"
  | "greenhouse_burst"
  | "live_session"
  | "radio_takeover";

export interface CampusWorldEventStub {
  id: string;
  kind: CampusWorldEventKind;
  /** Epoch ms — planeamento apenas. */
  startsAt: number;
  titlePt: string;
}

export interface CampusNpcStub {
  npcId: string;
  displayNamePt: string;
  /** Zona lógica onde vagueia / presta contexto. */
  homeZoneId?: string;
}

export interface CampusLivingWorldPlan {
  cyclePhase: CampusLivingCyclePhase;
  weather: CampusWeatherPreset;
  radioStationId: CampusRadioStationId;
  cinemaCrowdedHint: boolean;
  greenhouseActiveHint: boolean;
  npcs: CampusNpcStub[];
  upcomingEvents: CampusWorldEventStub[];
}
