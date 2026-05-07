let sitTimer: ReturnType<typeof setTimeout> | null = null;

/** Após caminhar até ao assento, passa posture para «sit» só se o drive-in seguir aberto com assento. */
export function scheduleCinemaSitAfterWalk(ms: number) {
  if (sitTimer) clearTimeout(sitTimer);
  sitTimer = setTimeout(() => {
    sitTimer = null;
    void import("@/stores/campusStore").then(({ useCampusStore }) => {
      const s = useCampusStore.getState();
      if (!s.isCineOpen || s.cinemaSeatIndex == null) return;
      s.setAvatarPosture("sit");
    });
  }, ms);
}

export function clearCinemaSitTimer() {
  if (sitTimer) clearTimeout(sitTimer);
  sitTimer = null;
}
