import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DotPointCard } from "./DotPointCard";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Point } from "@/types";

interface InputStackProps {
    onComplete: (points: Point[]) => void;
}

export const InputStack = ({ onComplete }: InputStackProps) => {
    const [points, setPoints] = useState<Point[]>([]);
    const [inputValue, setInputValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputCardRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim()) {
                addPoint(inputValue);
                setInputValue("");
            }
        }
    };

    const addPoint = (text: string) => {
        setPoints(prev => [...prev, { id: Date.now(), text }]);
    };

    useGSAP(() => {
        if (points.length === 0) return;

        const cards = gsap.utils.toArray('.dot-point-card') as HTMLElement[];
        if (cards.length > 0) {
           const lastCard = cards[cards.length - 1];

           let startY = 100;
           if (inputCardRef.current) {
                const inputRect = inputCardRef.current.getBoundingClientRect();
                const cardRect = lastCard.getBoundingClientRect();
                startY = inputRect.top - cardRect.top;
           }

           gsap.from(lastCard, {
               y: startY,
               opacity: 0,
               scale: 0.9,
               duration: 0.6,
               ease: "back.out(1.5)",
               clearProps: "all"
           });

           if (inputCardRef.current) {
                gsap.to(inputCardRef.current, {
                    y: 5,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
           }
        }
    }, { dependencies: [points], scope: containerRef });

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-end min-h-[80vh] w-full max-w-md mx-auto p-4 gap-4">
             <div ref={listRef} className="w-full flex flex-col justify-end gap-3 mb-4 flex-1">
                {points.map((p) => (
                    <DotPointCard key={p.id} text={p.text} className="dot-point-card" />
                ))}
             </div>

             <Card ref={inputCardRef} className="w-full relative z-10 bg-slate-900/80 backdrop-blur-sm border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                <div className="p-1">
                    <Textarea
                        placeholder="Type a point and press Enter..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border-0 focus-visible:ring-0 resize-none bg-transparent text-lg min-h-[60px] text-slate-50 placeholder:text-slate-500"
                    />
                </div>
             </Card>

             <div className="h-12 w-full flex items-center justify-center">
                 {points.length > 0 && (
                    <button
                        onClick={() => onComplete(points)}
                        className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest"
                    >
                        Start Sorting →
                    </button>
                 )}
             </div>
        </div>
    );
};
