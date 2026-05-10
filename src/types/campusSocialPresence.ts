/** Preferências de privacidade — persistidas em `Profile.campusSocialVisibility`. */
export type CampusSocialVisibility = "name" | "anonymous" | "hidden";

/** Estado leve exibido no cartão — não substitui chat nem estado complexo. */
export type CampusSocialStatusLight = "exploring" | "studying" | "cinema" | "rest";

export const CAMPUS_SOCIAL_VISIBILITY_LABELS_PT: Record<CampusSocialVisibility, string> = {
  name: "Mostrar o meu nome",
  anonymous: "Aparecer como colega anónimo",
  hidden: "Invisível para outros"
};

export const CAMPUS_SOCIAL_STATUS_LABELS_PT: Record<CampusSocialStatusLight, string> = {
  exploring: "A explorar",
  studying: "A estudar",
  cinema: "No cinema",
  rest: "Em pausa"
};

export function parseCampusSocialVisibility(raw: string | null | undefined): CampusSocialVisibility {
  if (raw === "anonymous" || raw === "hidden") return raw;
  return "name";
}

export function parseCampusSocialStatusLight(raw: string | null | undefined): CampusSocialStatusLight {
  if (raw === "studying" || raw === "cinema" || raw === "rest") return raw;
  return "exploring";
}
