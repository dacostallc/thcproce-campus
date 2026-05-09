"use client";

import { useCallback, useMemo, useState } from "react";

import { REFERRAL_REWARD_REFERRED, REFERRAL_REWARD_REFERRER } from "@/config/referralRewards";

type Props = {
  referralCode: string;
  inviteUrl: string;
  invitedCount: number;
  referralSouvenirEarned: number;
};

export function ProfileReferralSection({
  referralCode,
  inviteUrl,
  invitedCount,
  referralSouvenirEarned,
}: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [inviteUrl]);

  const rewardsHint = useMemo(
    () =>
      `Por cada amigo que se inscrever com o seu link: +${REFERRAL_REWARD_REFERRER} créditos para si e +${REFERRAL_REWARD_REFERRED} para o amigo (simbólicos).`,
    [],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Indicar amigos</h2>
      <p className="mt-1 text-xs text-white/50">
        Partilhe o seu código ou o link — sem e-mails automáticos nem pagamentos. {rewardsHint}
      </p>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-wider text-white/45">O seu código</dt>
          <dd className="mt-1 font-mono text-lg font-semibold tracking-wide text-canna-200">{referralCode}</dd>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-white/45">Link de convite</span>
            <p className="mt-1 break-all font-mono text-[11px] text-white/80">{inviteUrl}</p>
          </div>
          <button
            type="button"
            onClick={() => void onCopy()}
            className="shrink-0 rounded-lg bg-canna-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-canna-500"
          >
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-3">
            <div className="text-2xl font-bold text-white">{invitedCount}</div>
            <div className="text-[10px] text-white/45">Amigos inscritos</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-3">
            <div className="text-2xl font-bold text-sky-200">{referralSouvenirEarned}</div>
            <div className="text-[10px] text-white/45">Créditos por indicação</div>
          </div>
        </div>
      </dl>
    </div>
  );
}
