export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-slate-700 px-4 py-1 text-sm text-slate-300">
          TaskFlow Dashboard
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Modern Kanban project management dashboard
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          Organize tasks, manage priorities, track progress, and move work
          across a responsive drag-and-drop Kanban board.
        </p>
      </section>
    </main>
  );
}
