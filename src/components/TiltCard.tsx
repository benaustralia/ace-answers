import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const TiltCard = ({ text, onClick }: { text: string, onClick: () => void }) => {
   const ref = useRef<HTMLDivElement>(null);

   useGSAP(() => {
       const el = ref.current;
       if(!el) return;

       const onMove = (e: MouseEvent) => {
           const rect = el.getBoundingClientRect();
           const x = e.clientX - rect.left;
           const y = e.clientY - rect.top;

           // Normalize -0.5 to 0.5
           const xPct = (x / rect.width) - 0.5;
           const yPct = (y / rect.height) - 0.5;

           gsap.to(el.children[0], {
               rotationY: xPct * 30, // Tilt amount
               rotationX: -yPct * 30,
               transformPerspective: 500,
               duration: 0.4,
               ease: "power2.out"
           });
       };

       const onLeave = () => {
           gsap.to(el.children[0], {
               rotationY: 0,
               rotationX: 0,
               duration: 0.5,
               ease: "elastic.out(1, 0.5)"
           });
       };

       el.addEventListener('mousemove', onMove);
       el.addEventListener('mouseleave', onLeave);

       return () => {
           el.removeEventListener('mousemove', onMove);
           el.removeEventListener('mouseleave', onLeave);
       };
   }, { scope: ref });

   return (
       <div ref={ref} onClick={onClick} className="cursor-pointer min-w-[140px] h-[70px] p-2" style={{ perspective: '1000px' }}>
            <div className="w-full h-full bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center p-2 hover:border-sky-400 hover:bg-slate-700 transition-colors shadow-lg">
                <span className="text-sm font-semibold text-slate-100 select-none text-center leading-tight">{text}</span>
            </div>
       </div>
   );
}
