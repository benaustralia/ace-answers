import { useState } from 'react';
import { InputStack } from "@/components/InputStack";
import { Sorter } from "@/components/Sorter";
import { Synthesizer } from "@/components/Synthesizer";
import { ParagraphOutput } from "@/components/ParagraphOutput";
import type { Point, SortedPoint } from "@/types";

type Phase = 'INPUT' | 'SORT' | 'SYNTHESIZE' | 'REVEAL';

function App() {
  const [phase, setPhase] = useState<Phase>('INPUT');
  const [points, setPoints] = useState<Point[]>([]);
  const [sortedPoints, setSortedPoints] = useState<SortedPoint[]>([]);

  const handleInputComplete = (newPoints: Point[]) => {
      setPoints(newPoints);
      setPhase('SORT');
  };

  const handleSortComplete = (sorted: SortedPoint[]) => {
      setSortedPoints(sorted);
      setPhase('SYNTHESIZE');
  };

  const handleSynthesizeComplete = (finalPoints: SortedPoint[]) => {
      setSortedPoints(finalPoints);
      setPhase('REVEAL');
  };

  const handleReset = () => {
      setPoints([]);
      setSortedPoints([]);
      setPhase('INPUT');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-sky-500/30">
        <header className="p-4 flex flex-col items-center justify-center border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 gap-1">
            <h1 className="text-xl font-bold text-sky-400">ACE Builder</h1>
            <div className="text-xs text-slate-500 uppercase tracking-wider">
                {phase === 'INPUT' && "Phase 1: Brainstorm"}
                {phase === 'SORT' && "Phase 2: Sort"}
                {phase === 'SYNTHESIZE' && "Phase 3: Connect"}
                {phase === 'REVEAL' && "Phase 4: Review"}
            </div>
        </header>

        <main className="container mx-auto relative">
            {phase === 'INPUT' && <InputStack onComplete={handleInputComplete} />}
            {phase === 'SORT' && <Sorter points={points} onComplete={handleSortComplete} />}
            {phase === 'SYNTHESIZE' && <Synthesizer points={sortedPoints} onComplete={handleSynthesizeComplete} />}
            {phase === 'REVEAL' && <ParagraphOutput points={sortedPoints} onReset={handleReset} />}
        </main>

        <footer className="fixed bottom-0 right-0 z-[9999] opacity-75">
            <span className="text-[10px] font-mono text-slate-200 bg-slate-800 px-2 py-1 rounded-tl-md block">
                build: {__COMMIT_HASH__}
            </span>
        </footer>
    </div>
  )
}

export default App
