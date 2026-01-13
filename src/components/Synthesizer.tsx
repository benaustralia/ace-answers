import { useState } from 'react';
import { TiltCard } from './TiltCard';
import type { SortedPoint } from '@/types';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

const TRANSITIONS = ["Furthermore", "For example", "This illustrates", "However", "Therefore", "In addition", "Consequently", "Specifically", "In conclusion"];

interface SynthesizerProps {
    points: SortedPoint[];
    onComplete: (points: SortedPoint[]) => void;
}

export const Synthesizer = ({ points, onComplete }: SynthesizerProps) => {
    const [items, setItems] = useState<SortedPoint[]>(points);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(items.length > 0 ? 0 : null);

    const handleTransitionClick = (word: string) => {
        if (selectedIndex === null) return;

        const newItems = [...items];
        // Toggle if same
        if (newItems[selectedIndex].transition === word) {
            newItems[selectedIndex] = { ...newItems[selectedIndex], transition: undefined };
        } else {
            newItems[selectedIndex] = { ...newItems[selectedIndex], transition: word };
        }
        setItems(newItems);

        // Haptic shake on the card
        gsap.fromTo(`#card-${selectedIndex}`, { x: -3 }, { x: 3, duration: 0.05, yoyo: true, repeat: 5, clearProps: 'x' });
    };

    return (
       <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto">
            {/* Film Strip */}
            <div className="w-full">
                <p className="px-4 py-2 text-xs text-slate-500 uppercase tracking-widest">Select a sentence below, then tap a transition word</p>
                <div className="flex gap-2 overflow-x-auto p-4 items-center bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 scrollbar-hide mask-linear">
                    {TRANSITIONS.map(t => (
                        <TiltCard key={t} text={t} onClick={() => handleTransitionClick(t)} />
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {items.map((item, idx) => (
                    <div
                        id={`card-${idx}`}
                        key={item.id}
                        onClick={() => setSelectedIndex(idx)}
                        className={cn(
                            "p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 relative",
                            selectedIndex === idx ? "border-sky-500 bg-slate-800 shadow-[0_0_20px_rgba(14,165,233,0.1)] scale-[1.02]" : "border-slate-800 bg-slate-900 opacity-80 hover:opacity-100",
                            item.category === 'ANSWER' && "border-l-[6px] border-l-sky-500",
                            item.category === 'CITE' && "border-l-[6px] border-l-amber-500",
                            item.category === 'EXPLAIN' && "border-l-[6px] border-l-emerald-500",
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                             <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider",
                                item.category === 'ANSWER' && "bg-sky-500/20 text-sky-400",
                                item.category === 'CITE' && "bg-amber-500/20 text-amber-400",
                                item.category === 'EXPLAIN' && "bg-emerald-500/20 text-emerald-400",
                             )}>{item.category}</span>
                             {item.transition && (
                                 <span className="text-[10px] text-sky-400 font-mono">TRANSITION ADDED</span>
                             )}
                        </div>

                        <p className="text-lg leading-relaxed text-slate-200">
                            {item.transition && (
                                <span className="font-bold text-sky-400 mr-1 bg-sky-400/10 px-1 rounded">{item.transition},</span>
                            )}
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
                 <button
                    onClick={() => onComplete(items)}
                    className="pointer-events-auto bg-slate-50 text-slate-950 hover:bg-slate-200 font-bold py-3 px-8 rounded-full shadow-xl transform transition-transform hover:scale-105 active:scale-95"
                 >
                    Build Paragraph ✨
                 </button>
            </div>
       </div>
    );
};
