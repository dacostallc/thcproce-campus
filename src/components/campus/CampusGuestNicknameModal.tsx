"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialNickname: string | null;
  onSave: (nickname: string | null) => void;
};

export function CampusGuestNicknameModal({
  open,
  onOpenChange,
  initialNickname,
  onSave
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue(initialNickname ?? "");
  }, [open, initialNickname]);

  if (!open) return null;

  function submit() {
    const t = value.trim().slice(0, 32);
    if (t.length >= 2) {
      onSave(t);
    } else {
      onSave(null);
    }
    onOpenChange(false);
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[55] bg-black/45 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-nick-title"
        className="fixed left-1/2 top-[42%] z-[60] w-[min(92vw,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-ink-950/95 p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-2">
          <h2 id="guest-nick-title" className="text-base font-bold text-white">
            Nick de visitante
          </h2>
          <button
            type="button"
            className="rounded-lg p-1 text-white/65 hover:bg-white/10"
            aria-label="Fechar"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-white/55">
          Guardado na chave local <span className="font-mono text-[10px] text-white/40">thcproce.campus.guestNickname.v1</span>
          — não é conta THCProce nem aparece no ranking real. Para chat e progresso sincronizado, regista-te ou entra.
        </p>
        <label htmlFor="guest-nick-input" className="sr-only">
          Nickname de visitante
        </label>
        <input
          id="guest-nick-input"
          maxLength={32}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ex.: João · Verde"
          className="mt-4 w-full rounded-xl bg-black/35 border border-white/18 px-3 py-2.5 text-sm text-white outline-none focus:border-canna-400/45"
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <Button type="button" variant="glass" size="sm" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" size="sm" onClick={submit}>
            Guardar nick local
          </Button>
        </div>
      </div>
    </>
  );
}
