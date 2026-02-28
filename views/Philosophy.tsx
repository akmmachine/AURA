
import React from 'react';

const Philosophy: React.FC = () => {
  const revealRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="bg-white text-[#1A1A1A] selection:bg-black selection:text-white overflow-hidden">
      {/* Block 1 — The Grand Entrance (Purely Typographic) */}
      <section className="min-h-screen flex flex-col justify-center relative px-6 md:px-24 border-b border-slate-50">
        <div className="absolute top-1/2 right-10 md:right-24 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <span className="text-[30rem] font-serif leading-none tracking-tighter italic">A</span>
        </div>
        
        <div ref={addToRefs} className="reveal max-w-6xl relative z-10">
          <div className="flex items-center space-x-6 mb-12">
            <div className="w-12 h-px bg-black"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-black">AURA // THE ORIGIN</span>
          </div>
          
          <h1 className="text-7xl md:text-[12rem] font-serif leading-[0.8] tracking-tighter mb-16">
            Architecting <br />
            <span className="italic pl-4 md:pl-24 text-slate-300">Silence.</span>
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-12 border-t border-slate-100">
            <p className="text-xl md:text-3xl font-light leading-snug max-w-xl text-slate-800 uppercase tracking-tight">
              A study in restraint. <br />
              Garments that speak through <br />
              substance and negative space.
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">EST. 2024 / MUMBAI</span>
          </div>
        </div>
      </section>

      {/* Block 2 — The Structural Void (Geometric Layout) */}
      <section className="py-40 md:py-64 px-6 md:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 items-start">
          <div ref={addToRefs} className="reveal md:col-span-5 md:pr-20">
             <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-12">01 / HONEST MATERIALITY</h2>
             <p className="text-4xl md:text-6xl font-serif leading-[1.1] mb-12 tracking-tighter">
               The raw <br /> logic of <br /> fiber.
             </p>
             <p className="text-sm font-light text-slate-500 leading-relaxed uppercase tracking-[0.2em] max-w-xs">
               Exclusively Mongolian cashmere, Italian leathers, and organic cotton. <br /><br />
               No synthetics. <br />
               No compromises.
             </p>
          </div>
          
          <div ref={addToRefs} className="reveal md:col-span-7 aspect-[16/9] md:aspect-square bg-slate-50 border border-slate-100 flex items-center justify-center p-20 relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] text-[15rem] font-bold tracking-tighter group-hover:scale-110 transition-transform duration-[3s]">VOID</div>
            <div className="w-px h-full bg-slate-200 absolute left-1/2 -translate-x-1/2"></div>
            <div className="h-px w-full bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 text-center space-y-4">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase border border-black px-6 py-3 block">Pure Form</span>
              <span className="text-[9px] font-light italic tracking-widest text-slate-400 block">Structural Integrity Index 1.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Block 3 — The Manifesto (Typography Focus) */}
      <section className="bg-[#111] text-white py-40 md:py-80 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 flex flex-col justify-between p-12">
           <div className="flex justify-between text-[8px] font-bold tracking-[1em] uppercase"><span>ARCHITECTURAL</span><span>SYSTEMS</span></div>
           <div className="flex justify-between text-[8px] font-bold tracking-[1em] uppercase"><span>MINIMALIST</span><span>PRINCIPLES</span></div>
        </div>
        
        <div ref={addToRefs} className="reveal max-w-4xl mx-auto text-center px-6 relative z-10">
           <h3 className="text-5xl md:text-9xl font-serif italic mb-16 leading-none">
             "Fashion is temporary. <br /> 
             Character is permanent."
           </h3>
           <div className="w-16 h-px bg-white mx-auto mb-16"></div>
           <p className="text-[11px] font-bold uppercase tracking-[1em] text-white/40">The AURA Perspective</p>
        </div>
      </section>

      {/* Block 4 — The Process (Whitespace & Line Work) */}
      <section className="py-40 md:py-72 px-6 md:px-24 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
          <div ref={addToRefs} className="reveal space-y-24">
             <div className="border-l border-black pl-12 py-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-8">02 / MEASURED PRODUCTION</h2>
                <p className="text-4xl md:text-7xl font-serif leading-none tracking-tighter">
                  Resisting <br /> the <br /> <span className="text-slate-200 italic">Cycle.</span>
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <span className="text-3xl font-serif italic">1.</span>
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-loose text-slate-500">
                    We release in limited editions to prevent overproduction.
                  </p>
                </div>
                <div className="space-y-4">
                  <span className="text-3xl font-serif italic">2.</span>
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-loose text-slate-500">
                    Every seam is reinforced for multi-generational wear.
                  </p>
                </div>
             </div>
          </div>
          
          <div ref={addToRefs} className="reveal flex flex-col justify-center items-center md:items-end">
             <div className="w-full max-w-md aspect-[3/4] bg-slate-50 border border-slate-100 p-12 flex flex-col justify-between">
                <span className="text-[8px] font-bold tracking-[0.5em] text-slate-300 uppercase">SPECIFICATION SHEET</span>
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sustainability</span>
                    <span className="text-[10px] italic">Intrinsic</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Design</span>
                    <span className="text-[10px] italic">Reductive</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Fit</span>
                    <span className="text-[10px] italic">Anatomical</span>
                  </div>
                </div>
                <div className="text-[8px] font-mono text-slate-200 leading-none">
                  01010010 01000101 01000100 01010101 01000011 01000101
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Block 5 — Final Manifesto (Grand Scale) */}
      <section className="py-64 md:py-96 px-6 text-center bg-[#FAF9F6] relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
           <h1 className="text-[40rem] font-bold tracking-tighter uppercase select-none leading-none -ml-40">AURA</h1>
        </div>
        
        <div ref={addToRefs} className="reveal max-w-4xl mx-auto relative z-10 space-y-12">
          <span className="text-[10px] font-bold uppercase tracking-[1em] text-slate-400">THE MANIFESTO</span>
          <h2 className="text-5xl md:text-[10rem] font-serif leading-none tracking-tighter uppercase italic">
            Less, <br /> but better.
          </h2>
          <div className="pt-24 flex flex-col items-center">
             <div className="w-px h-24 bg-black mb-12"></div>
             <button 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                className="text-[10px] font-bold uppercase tracking-[0.5em] border border-black/10 px-12 py-6 rounded-full hover:bg-black hover:text-white transition-all duration-700"
              >
                Return to Surface
              </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Philosophy;
