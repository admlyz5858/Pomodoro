import { usePersistence } from './hooks/use-persistence.ts';
import { TimerView } from './features/timer/TimerView.tsx';

function LoadingScreen() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-sm text-text-muted">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  const ready = usePersistence();

  if (!ready) return <LoadingScreen />;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-center pt-8 pb-4">
        <h1 className="text-lg font-semibold tracking-wide text-text-primary">
          <span className="text-accent">Focus</span> Universe
        </h1>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <TimerView />
      </main>
    </div>
  );
}
