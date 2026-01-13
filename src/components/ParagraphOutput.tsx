import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { SortedPoint } from '@/types';

interface ParagraphOutputProps {
    points: SortedPoint[];
    onReset: () => void;
}

export const ParagraphOutput = ({ points, onReset }: ParagraphOutputProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const compiledText = points.map(p => {
        let t = p.text.trim();
        // Ensure punctuation if missing
        if (!/[.!?]$/.test(t)) t += ".";

        // Capitalize first letter if needed
        t = t.charAt(0).toUpperCase() + t.slice(1);

        if (p.transition) {
            return `${p.transition}, ${t.charAt(0).toLowerCase() + t.slice(1)}`;
            // "Furthermore, this is a point." -> Lowercase the original start unless it's "I" or proper noun?
            // Simple logic: lowercase first char of original text if we add a transition.
            // Risk: Proper nouns "John" -> "Furthermore, john".
            // Better: Keep it simple. Let's assume user types sentences.
            // If I say "The cat", and add "However", "However, the cat".
            // If I say "I am", -> "However, I am".
            // I'll stick to just prepending for safety, or just decapitalize if commonly safe.
            // Let's just prepend. "However, The cat" is acceptable in drafts, logic to decapitalize is complex without NLP.
            return `${p.transition}, ${t}`;
        }
        return t;
    }).join(" ");

    useGSAP(() => {
        // Liquid Reveal using clip-path
        // Start from small circle
        gsap.fromTo(containerRef.current,
            { clipPath: 'circle(0% at 50% 50%)', opacity: 1 },
            { clipPath: 'circle(150% at 50% 50%)', duration: 2.0, ease: "power4.inOut", delay: 0.2 }
        );

        // Text fade in slightly delayed
        gsap.from("p", { opacity: 0, y: 20, duration: 1, delay: 1, ease: "power2.out" });

    }, { scope: containerRef });

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto p-4">
             <div className="relative w-full">
                 {/* Background decoration or placeholder before reveal */}
                 <div className="absolute inset-0 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                     <span className="text-slate-600 animate-pulse">Generative Ink Flowing...</span>
                 </div>

                 {/* The Revealed Content */}
                 <div ref={containerRef} className="bg-[#f0f0f0] text-[#1a1a1a] p-8 md:p-12 rounded-lg shadow-[0_0_50px_rgba(255,255,255,0.1)] relative overflow-hidden min-h-[300px] w-full z-10">
                     {/* Paper texture overlay could go here */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-amber-500 to-emerald-500" />

                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Paragraph</h2>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-sky-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                        </div>
                     </div>

                     <p className="font-serif text-xl md:text-2xl leading-loose text-justify">
                        {compiledText}
                     </p>

                 </div>
             </div>

             <button onClick={onReset} className="mt-12 text-slate-500 hover:text-white transition-colors uppercase text-xs tracking-[0.2em]">
                Start New Session
             </button>
        </div>
    );
};
