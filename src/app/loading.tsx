export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-ink-900">
      <div className="h-10 w-10 rounded-full border-2 border-canna-400/40 border-t-canna-400 animate-spin" />
      <p className="text-sm text-white/60">Carregando campus…</p>
    </div>
  );
}
