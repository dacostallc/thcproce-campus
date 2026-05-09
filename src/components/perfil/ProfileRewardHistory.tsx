import { REWARD_LOG_TYPE_LABEL_PT } from "@/lib/rewards/rewardLogTypes";

export type ProfileRewardHistoryRow = {
  id: string;
  type: string;
  source: string | null;
  description: string;
  xpAmount: number;
  souvenirCreditsAmount: number;
  createdAt: Date;
};

type Props = {
  logs: ProfileRewardHistoryRow[];
};

export function ProfileRewardHistory({ logs }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Histórico de recompensas</h2>
      <p className="mt-1 text-xs text-white/50">Últimos eventos de XP, créditos souvenir e desbloqueios.</p>

      {logs.length === 0 ? (
        <p className="mt-3 text-sm text-white/55">
          Ainda não há eventos registados. Aprove quizzes, missões e convites para ver o histórico aqui.
        </p>
      ) : (
        <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
          {logs.map((log) => {
            const label = REWARD_LOG_TYPE_LABEL_PT[log.type] ?? log.type;
            const xp = log.xpAmount > 0 ? `+${log.xpAmount} XP` : null;
            const souvenirs =
              log.souvenirCreditsAmount > 0 ? `+${log.souvenirCreditsAmount} souvenir` : null;
            const amounts = [xp, souvenirs].filter(Boolean).join(" · ");
            return (
              <li
                key={log.id}
                className="rounded-lg border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white/85"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-canna-300/90">
                    {label}
                  </span>
                  <time
                    className="text-[10px] text-white/40"
                    dateTime={log.createdAt.toISOString()}
                  >
                    {log.createdAt.toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
                <p className="mt-1 text-xs text-white/80">{log.description}</p>
                {log.source ? (
                  <p className="mt-0.5 font-mono text-[10px] text-white/35">{log.source}</p>
                ) : null}
                {amounts ? <p className="mt-1 text-[11px] text-gold-300/85">{amounts}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
