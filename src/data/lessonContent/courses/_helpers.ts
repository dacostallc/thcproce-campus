/** Helpers para ficheiros de conteúdo — manter consistência de quiz e media flags. */

export const Q = (
  question: string,
  a: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3
) => ({ question, options: a, correctIndex });

export const M = {
  all: {
    needsVideo: true,
    needsImage: true,
    needsInfographic: true,
    needsSupportMaterial: true
  } as const,
  theory: {
    needsVideo: true,
    needsImage: false,
    needsInfographic: true,
    needsSupportMaterial: true
  } as const,
  lab: {
    needsVideo: true,
    needsImage: true,
    needsInfographic: true,
    needsSupportMaterial: true
  } as const
};
