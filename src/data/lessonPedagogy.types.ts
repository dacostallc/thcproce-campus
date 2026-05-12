/** Extensão editorial opcional — experiência pedagógica imersiva no campus. */
export type LessonPedagogyExtras = {
  humanOpening?: string;
  practicalObjectiveLead?: string;
  practicalExplanation?: string;
  stepByStep?: string[];
  realExample?: string;
  commonMistakes?: string;
  professionalObservation?: string;
  operationalSummary?: string;
  exercise?: string;
  nextLessonBridge?: string;
  progression?: {
    xpReward?: number;
    difficultyLabel?: string;
    estimatedMinutes?: number;
    category?: string;
    evolutionStage?: string;
  };
};
