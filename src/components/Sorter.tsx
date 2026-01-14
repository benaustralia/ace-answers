import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import type { Point, SortedPoint, Category } from '@/types';
import { DotPointCard } from './DotPointCard';
import { cn } from '@/lib/utils';

gsap.registerPlugin(Draggable);

interface SorterProps {
    points: Point[];
    onComplete: (sortedPoints: SortedPoint[]) => void;
}

export const Sorter = ({ points, onComplete }: SorterProps) => {
    const [sorted, setSorted] = useState<SortedPoint[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Bucket refs for animation
    const answerRef = useRef<HTMLDivElement>(null);
    const citeRef = useRef<HTMLDivElement>(null);
    const explainRef = useRef<HTMLDivElement>(null);

    const [dragDirection, setDragDirection] = useState<Category | null>(null);

    const currentPoint = points[currentIndex];

    useGSAP(() => {
        if (!currentPoint || !cardRef.current || !containerRef.current) return;

        const draggable = Draggable.create(cardRef.current, {
            type: "x,y",
            edgeResistance: 0.5,
            bounds: containerRef.current,
            inertia: true,
            onDrag: function() {
                const x = this.x;
                const y = this.y;
                const threshold = 60; // Reduced threshold for visual feedback

                let dir: Category | null = null;

                // Check collisions first (more intuitive)
                if (answerRef.current && this.hitTest(answerRef.current, "10%")) {
                    dir = 'ANSWER';
                } else if (citeRef.current && this.hitTest(citeRef.current, "10%")) {
                    dir = 'CITE';
                } else if (explainRef.current && this.hitTest(explainRef.current, "10%")) {
                    dir = 'EXPLAIN';
                }
                // Fallback to directional threshold
                else if (y < -threshold * 1.5) {
                    dir = 'ANSWER';
                } else if (x < -threshold) {
                    dir = 'CITE';
                } else if (x > threshold) {
                    dir = 'EXPLAIN';
                }

                setDragDirection(dir);
            },
            onDragEnd: function() {
                const x = this.x;
                const y = this.y;
                const threshold = 70; // Reduced threshold for action (was 100)

                let chosenCategory: Category | null = null;

                // Check collisions first
                if (answerRef.current && this.hitTest(answerRef.current, "20%")) {
                    chosenCategory = 'ANSWER';
                } else if (citeRef.current && this.hitTest(citeRef.current, "20%")) {
                    chosenCategory = 'CITE';
                } else if (explainRef.current && this.hitTest(explainRef.current, "20%")) {
                    chosenCategory = 'EXPLAIN';
                }
                // Fallback to coordinate threshold
                else if (y < -threshold * 1.5) {
                    chosenCategory = 'ANSWER';
                } else if (x < -threshold) {
                    chosenCategory = 'CITE';
                } else if (x > threshold) {
                    chosenCategory = 'EXPLAIN';
                }

                if (chosenCategory) {
                    let targetX = 0;
                    let targetY = 0;

                    if (chosenCategory === 'ANSWER') targetY = -window.innerHeight;
                    if (chosenCategory === 'CITE') targetX = -window.innerWidth;
                    if (chosenCategory === 'EXPLAIN') targetX = window.innerWidth;

                    gsap.to(this.target, {
                        x: targetX,
                        y: targetY,
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            handleSort(chosenCategory!);
                            gsap.set(this.target, { x: 0, y: 0, opacity: 1 });
                        }
                    });
                } else {
                    gsap.to(this.target, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: "elastic.out(1, 0.5)"
                    });
                    setDragDirection(null);
                }
            }
        })[0];

        return () => {
            if (draggable) draggable.kill();
        };

    }, { dependencies: [currentIndex, currentPoint], scope: containerRef });

    const handleSort = (category: Category) => {
        const newSorted = [...sorted, { ...currentPoint, category }];
        setSorted(newSorted);
        setDragDirection(null);

        // Visual feedback on the bucket
        const targetRef = category === 'ANSWER' ? answerRef : category === 'CITE' ? citeRef : explainRef;
        if (targetRef.current) {
            gsap.fromTo(targetRef.current,
                { scale: 1.4, rotate: 0 },
                { scale: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" }
            );
        }

        if (currentIndex < points.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(newSorted);
        }
    };

    if (!currentPoint) return (
        <div className="flex items-center justify-center h-full">
            <p className="text-xl text-slate-500 animate-pulse">Sorting Complete...</p>
        </div>
    );

    return (
        <div ref={containerRef} className="relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden touch-none select-none">

            {/* Top Zone (Answer) */}
             <div ref={answerRef} className={cn("absolute top-8 left-0 right-0 mx-auto w-32 p-4 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-2",
                dragDirection === 'ANSWER' ? "scale-110 border-sky-500 bg-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.3)]" : "border-slate-800/50 text-slate-600"
            )}>
                 <div className={cn("w-3 h-3 rounded-full bg-sky-500", dragDirection === 'ANSWER' && "animate-ping")} />
                 <span className={cn("text-xs font-bold uppercase", dragDirection === 'ANSWER' ? "text-sky-500" : "text-slate-600")}>Answer</span>
            </div>

            {/* Bottom Left Zone (Cite) */}
            <div ref={citeRef} className={cn("absolute bottom-20 left-4 w-28 p-4 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-2",
                dragDirection === 'CITE' ? "scale-110 border-amber-500 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]" : "border-slate-800/50 text-slate-600"
            )}>
                 <div className={cn("w-3 h-3 rounded-full bg-amber-500", dragDirection === 'CITE' && "animate-ping")} />
                 <span className={cn("text-xs font-bold uppercase", dragDirection === 'CITE' ? "text-amber-500" : "text-slate-600")}>Cite</span>
            </div>

            {/* Bottom Right Zone (Explain) */}
            <div ref={explainRef} className={cn("absolute bottom-20 right-4 w-28 p-4 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-2",
                dragDirection === 'EXPLAIN' ? "scale-110 border-emerald-500 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "border-slate-800/50 text-slate-600"
            )}>
                 <div className={cn("w-3 h-3 rounded-full bg-emerald-500", dragDirection === 'EXPLAIN' && "animate-ping")} />
                 <span className={cn("text-xs font-bold uppercase", dragDirection === 'EXPLAIN' ? "text-emerald-500" : "text-slate-600")}>Explain</span>
            </div>

            {/* Card Stack */}
            <div className="relative z-10 w-full max-w-sm px-4">
               {/* Next card preview */}
               {points[currentIndex + 1] && (
                   <div className="absolute top-0 left-0 w-full px-4 transform scale-95 opacity-40 translate-y-4 -z-10">
                        <DotPointCard text={points[currentIndex + 1].text} />
                   </div>
               )}

               <div ref={cardRef} className="cursor-grab active:cursor-grabbing will-change-transform">
                    <DotPointCard text={currentPoint.text} className={cn(
                        "transition-shadow duration-300",
                        dragDirection === 'ANSWER' && "shadow-[0_0_30px_rgba(14,165,233,0.5)] border-sky-500",
                        dragDirection === 'CITE' && "shadow-[0_0_30px_rgba(245,158,11,0.5)] border-amber-500",
                        dragDirection === 'EXPLAIN' && "shadow-[0_0_30px_rgba(16,185,129,0.5)] border-emerald-500",
                    )} />
               </div>
            </div>

            <div className="absolute bottom-8 text-xs text-slate-500 font-mono">
                {currentIndex + 1} / {points.length}
            </div>
        </div>
    );
};
