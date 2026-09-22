import React, { useState } from 'react';
import { CoverflowStage, DEFAULT_COVERFLOW_SLIDES } from './CoverflowStage';

interface CoverflowLandingPageProps {
  onSwitchToFactorySite?: () => void;
}

export const CoverflowLandingPage: React.FC<CoverflowLandingPageProps> = ({
  onSwitchToFactorySite,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-200 font-sans-coverflow antialiased selection:bg-[#2dd4bf]/30 selection:text-white relative overflow-x-hidden" dir="ltr">
      {/* Optional Top Bar for switching to the Factory Site if user wants */}
      {onSwitchToFactorySite && (
        <div className="bg-[#0e141b] border-b border-white/10 px-4 py-1.5 text-center text-xs flex items-center justify-center gap-3">
          <span className="text-slate-400">نمایش وبسایت صنعتی آیدیا هوم:</span>
          <button
            onClick={onSwitchToFactorySite}
            className="text-[#2dd4bf] hover:underline font-bold font-vazir cursor-pointer flex items-center gap-1"
          >
            <span>ورود به سایت کارخانه و کاتالوگ محصولات</span>
            <span aria-hidden="true">←</span>
          </button>
        </div>
      )}

      {/* Sticky Frosted-Ink Top Nav */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0b0f14]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Brand Cluster (Left) */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#2dd4bf] to-[#e879f9] shadow-lg shadow-[#2dd4bf]/20">
              <svg className="w-[18px] h-[18px] text-[#0b0f14]" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM184,200H40V88H184Zm32-32H200V88a16,16,0,0,0-16-16H72V56H216Z" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-white transition-colors">
              Coverflow
            </span>
          </a>

          {/* Nav Row (Center - Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#showcase" className="transition hover:text-white">Showcase</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#templates" className="transition hover:text-white">Templates</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
          </div>

          {/* Right Cluster */}
          <div className="flex items-center gap-3">
            <a 
              href="#signin" 
              onClick={(e) => { e.preventDefault(); setDemoModalOpen(true); }}
              className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign in
            </a>
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0b0f14] transition hover:bg-[#2dd4bf] hover:shadow-lg hover:shadow-[#2dd4bf]/20 active:scale-95 cursor-pointer"
            >
              Start free
            </button>
            <button
              type="button"
              id="menuBtn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobileMenu"
              aria-label="Toggle navigation menu"
              className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        <div 
          id="mobileMenu" 
          className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-white/5 bg-[#0b0f14]/95 backdrop-blur-xl px-6 py-4 flex flex-col space-y-2 animate-in slide-in-from-top-2 duration-200`}
        >
          <a 
            href="#showcase" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            Showcase
          </a>
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            Features
          </a>
          <a 
            href="#templates" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            Templates
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            Pricing
          </a>
          <a 
            href="#signin" 
            onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setDemoModalOpen(true); }}
            className="sm:hidden rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* Header Hero */}
      <header className="relative w-full overflow-hidden">
        {/* Layered Atmosphere */}
        <div className="aurora" />
        <div className="aurora-mid" style={{ top: '15%', opacity: 0.55 }} />
        <div className="absolute inset-0 grid-tex" />

        {/* Hero Intro */}
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-10 text-center sm:pt-20">
          {/* Status Pill */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_8px] shadow-[#2dd4bf]" />
            <span>New: depth-aware coverflow engine</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl max-w-4xl mx-auto">
            Carousels that<br />
            <span className="gradient-text">turn heads</span>, not stomachs.
          </h1>

          {/* Lead */}
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Generate cinematic 3D coverflow galleries from a single prompt. Depth you can feel, momentum you can trust.
          </p>
        </div>

        {/* 3D Coverflow Centerpiece Stage (Target for selector #home-company-photos-section) */}
        <section 
          id="home-company-photos-section" 
          className="relative mx-auto max-w-5xl px-4 pb-6 sm:px-6"
        >
          {/* Teal glow oval behind stage */}
          <div className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto h-24 max-w-2xl rounded-[100%] bg-[#2dd4bf]/10 blur-3xl" />

          {/* 3D Stage Component */}
          <CoverflowStage slides={DEFAULT_COVERFLOW_SLIDES} initialIndex={3} />
        </section>

        {/* Hero CTA Pair + Trust Line */}
        <div className="relative mx-auto mt-4 max-w-6xl px-6 pb-16 text-center">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#e879f9] px-7 py-3.5 text-sm font-semibold text-[#0b0f14] shadow-xl shadow-[#2dd4bf]/20 hover:shadow-[#2dd4bf]/40 transition-all active:scale-95 cursor-pointer"
            >
              <span>Build your carousel</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 256 256" fill="currentColor">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
              </svg>
            </button>

            {/* Secondary Glass Button */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('showcase');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#2dd4bf]" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32Z" />
              </svg>
              <span>Watch it move</span>
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Trusted by 12,000+ product teams · No credit card
          </p>
        </div>
      </header>

      {/* Logo Strip */}
      <section className="relative w-full border-y border-white/5 bg-[#0e141b]/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-5 px-6 py-7">
          {['Lumen', 'Northwind', 'Parallax', 'Halcyon', 'Vela', 'Driftwood'].map((brand) => (
            <span
              key={brand}
              className="font-display text-lg font-semibold tracking-tight text-slate-300/90 hover:text-white transition-colors select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Feature Grid (3-Up Glass Cards) */}
      <section id="features" className="relative w-full py-24">
        <div className="aurora-mid" style={{ top: '10%', opacity: 0.4 }} />
        
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2dd4bf]">
              The engine
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Depth you can feel, motion you can trust
            </h2>
            <p className="mt-4 text-slate-400">
              Engineered with GPU acceleration, native hardware transforms, and sub-pixel optical physics.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-7 hover:border-white/20 transition-all group">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2dd4bf]/15 text-[#2dd4bf]">
                <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44L128,120,47.66,76ZM40,90l80,43.81v88.37L40,178.37ZM136,222.18V133.81L216,90v88.37Z" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                True 3D perspective
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                1600px CSS perspective camera with real Z-axis recession, 42° tilt, and optical card dimming.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-7 hover:border-white/20 transition-all group">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e879f9]/15 text-[#e879f9]">
                <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M215.79,118.17a8,8,0,0,0-7.79-6.17H152V40a8,8,0,0,0-13.66-5.66l-96,96a8,8,0,0,0,5.66,13.66H104v72a8,8,0,0,0,13.66,5.66l96-96A8,8,0,0,0,215.79,118.17ZM120,204.69V152a8,8,0,0,0-8-8H59.31L136,67.31V120a8,8,0,0,0,8,8h52.69Z" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                60fps momentum
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Silky <code className="text-[#2dd4bf] text-xs">cubic-bezier(.22,.61,.36,1)</code> easing curves calibrated to match natural finger inertia and spring physics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-7 hover:border-white/20 transition-all group">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2dd4bf]/15 text-[#2dd4bf]">
                <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Zm-88-56a12,12,0,1,0-12-12A12,12,0,0,0,128,72Zm36.56,43.2a8,8,0,0,0-10.24-4.32L128,121.49l-26.32-10.61a8,8,0,0,0-6,14.84l24.32,9.81V168a8,8,0,0,0,16,0V135.53l24.32-9.81A8,8,0,0,0,164.56,115.2Z" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                A11y by default
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Full keyboard arrows (ArrowLeft/ArrowRight), ARIA role landmarks, screen reader labels, and focus rings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Split (Copy + Terminal Card) */}
      <section id="showcase" className="relative w-full border-t border-white/5 bg-[#0e141b]/50 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e879f9]">
              From prompt to motion
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Describe it. Watch it come alive.
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              No keyframes to babysit. Simply declare your card contents or pass an array of items, and Coverflow renders 3D depth with mathematically sound perspective.
            </p>

            {/* Checklist */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-6 w-6 place-items-center shrink-0 rounded-full bg-[#2dd4bf]/15 text-[#2dd4bf]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-white text-sm font-semibold">Live theming:</strong>
                  <span className="text-slate-400 text-sm ml-1.5">Aurora, neon, titanium, or warm parchment palettes instantly available.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-6 w-6 place-items-center shrink-0 rounded-full bg-[#e879f9]/15 text-[#e879f9]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-white text-sm font-semibold">Export anywhere:</strong>
                  <span className="text-slate-400 text-sm ml-1.5">Zero runtime lock-in. Clean pure CSS + React, Vue, or Web Component output.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-6 w-6 place-items-center shrink-0 rounded-full bg-[#2dd4bf]/15 text-[#2dd4bf]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-white text-sm font-semibold">Responsive by design:</strong>
                  <span className="text-slate-400 text-sm ml-1.5">Automated stage contraction and distance culling on tablet and mobile viewports.</span>
                </div>
              </div>
            </div>

            <a
              href="#templates"
              className="mt-9 inline-flex items-center gap-2 rounded-full border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 px-6 py-3 text-sm font-semibold text-[#2dd4bf] hover:bg-[#2dd4bf]/20 transition-colors"
            >
              <span>Explore the playground</span>
              <svg className="w-4 h-4" viewBox="0 0 256 256" fill="currentColor">
                <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
              </svg>
            </a>
          </div>

          {/* Right Column: Faux Terminal CLI */}
          <div className="glass relative rounded-2xl p-1.5 shadow-2xl">
            <div className="rounded-xl bg-[#0b0f14] p-5 font-mono text-[13px] leading-relaxed border border-white/5">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-slate-500 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-slate-400">prompt</span>
                </div>
                <span className="text-[11px] text-slate-600">zsh</span>
              </div>

              {/* Command Line */}
              <div>
                <span className="text-[#e879f9] font-bold">$</span>{' '}
                <span className="text-slate-200 font-semibold">coverflow generate</span>
              </div>

              {/* Quoted prompt */}
              <div className="text-slate-500 mt-2 pl-4 border-l-2 border-slate-700/60">
                &ldquo;Dark aurora coverflow carousel with 7 gradient cards, 42° tilt, teal-to-magenta glow, and pill pagination&rdquo;
              </div>

              {/* Result block with teal checkmarks */}
              <div className="mt-5 space-y-1.5 pl-1">
                <div className="text-[#2dd4bf] flex items-center gap-2">
                  <span>✓</span>
                  <span className="text-slate-300">geometry · 7 cards, 42° tilt</span>
                </div>
                <div className="text-[#2dd4bf] flex items-center gap-2">
                  <span>✓</span>
                  <span className="text-slate-300">easing · cubic-bezier(.22,.61,.36,1)</span>
                </div>
                <div className="text-[#2dd4bf] flex items-center gap-2">
                  <span>✓</span>
                  <span className="text-slate-300">aurora · aqua → magenta</span>
                </div>
                <div className="mt-4 text-[#e879f9] flex items-center gap-1.5 font-bold">
                  <span>→</span>
                  <span>rendered in 0.8s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid (3-Up Gradient-Thumb Cards) */}
      <section id="templates" className="relative w-full py-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header Row */}
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2dd4bf]">
                Starting points
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Templates that already move
              </h2>
            </div>
            <a 
              href="#templates" 
              onClick={(e) => { e.preventDefault(); setDemoModalOpen(true); }}
              className="text-sm font-semibold text-slate-300 hover:text-[#2dd4bf] transition-colors cursor-pointer"
            >
              Browse all 60+ →
            </a>
          </div>

          {/* Cards Grid */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Template 1 */}
            <article 
              onClick={() => setDemoModalOpen(true)}
              className="group glass overflow-hidden rounded-2xl hover:-translate-y-1 hover:border-[#2dd4bf]/40 transition-all duration-300 cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-[#2dd4bf]/30 via-[#0e141b] to-[#e879f9]/20 relative overflow-hidden flex items-center justify-center">
                <div className="w-20 h-28 rounded-xl bg-gradient-to-tr from-[#0d9488] to-[#2dd4bf] shadow-lg border border-white/20 transform rotate-[-8deg] group-hover:rotate-0 transition-transform duration-500" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0b0f14]/60" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-white group-hover:text-[#2dd4bf] transition-colors">
                  Aurora Gallery
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Vibrant multi-hued light ribbons with glowing focal card.
                </p>
              </div>
            </article>

            {/* Template 2 */}
            <article 
              onClick={() => setDemoModalOpen(true)}
              className="group glass overflow-hidden rounded-2xl hover:-translate-y-1 hover:border-[#e879f9]/40 transition-all duration-300 cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-[#e879f9]/30 via-[#0e141b] to-[#38bdf8]/20 relative overflow-hidden flex items-center justify-center">
                <div className="w-20 h-28 rounded-xl bg-gradient-to-tr from-[#701a75] to-[#e879f9] shadow-lg border border-white/20 transform rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0b0f14]/60" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-white group-hover:text-[#e879f9] transition-colors">
                  Product Reel
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Clean packaging cards with quick specs and purchase triggers.
                </p>
              </div>
            </article>

            {/* Template 3 */}
            <article 
              onClick={() => setDemoModalOpen(true)}
              className="group glass overflow-hidden rounded-2xl hover:-translate-y-1 hover:border-[#2dd4bf]/40 transition-all duration-300 cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-[#06b6d4]/30 via-[#0e141b] to-[#a855f7]/20 relative overflow-hidden flex items-center justify-center">
                <div className="w-20 h-28 rounded-xl bg-gradient-to-tr from-[#1e3a8a] to-[#38bdf8] shadow-lg border border-white/20 transform rotate-[6deg] group-hover:rotate-0 transition-transform duration-500" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0b0f14]/60" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-white group-hover:text-[#2dd4bf] transition-colors">
                  Team Faces
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Executive bios and speaker line-ups with social badges.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="relative w-full overflow-hidden border-t border-white/5 py-24">
        <div className="aurora-mid" style={{ top: '0%', opacity: 0.55 }} />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Ship a carousel<br />worth swiping.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-slate-400">
            Export ready-to-mount components or embed with a single CDN script tag. No license restrictions.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#e879f9] px-8 py-3.5 text-sm font-semibold text-[#0b0f14] shadow-xl shadow-[#e879f9]/20 hover:shadow-[#e879f9]/40 transition-all active:scale-95 cursor-pointer"
            >
              Start free
            </button>
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition-all cursor-pointer"
            >
              Book a demo
            </button>
          </div>
        </div>
      </section>

      {/* Social Footer */}
      <footer className="relative w-full border-t border-white/5 bg-[#0e141b]/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          {/* Brand cluster (Left) */}
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#2dd4bf] to-[#e879f9]">
              <svg className="w-[15px] h-[15px] text-[#0b0f14]" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM184,200H40V88H184Zm32-32H200V88a16,16,0,0,0-16-16H72V56H216Z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white tracking-tight">
              Coverflow
            </span>
          </div>

          {/* Copyright (Center) */}
          <div className="text-xs text-slate-400">
            © 2026 Coverflow Labs. Crafted in the dark.
          </div>

          {/* Social Icons (Right) */}
          <div className="flex items-center gap-4 text-slate-400">
            {/* X Logo */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2dd4bf] transition-colors" aria-label="X (Twitter)">
              <svg className="w-4 h-4" viewBox="0 0 256 256" fill="currentColor">
                <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.9,94.27,35.53A8,8,0,0,0,88,32H40a8,8,0,0,0-6.75,12.29l62.6,98.38L34.08,210.62a8,8,0,1,0,11.84,10.76l58.84-64.72,49,64.38A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z" />
              </svg>
            </a>
            {/* GitHub Logo */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2dd4bf] transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4" viewBox="0 0 256 256" fill="currentColor">
                <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.72-3.69,43.91,43.91,0,0,1,32.33-20.06A43.76,43.76,0,0,1,192,73.83a8,8,0,0,0,1.09,7.69A41.7,41.7,0,0,1,200,104Z" />
              </svg>
            </a>
            {/* Dribbble Logo */}
            <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2dd4bf] transition-colors" aria-label="Dribbble">
              <svg className="w-4 h-4" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm76.51,60.85a87.69,87.69,0,0,1,11,40.15A170.82,170.82,0,0,0,154,117.29,176.62,176.62,0,0,0,204.51,84.85ZM128,40a87.77,87.77,0,0,1,61.76,25.43A160.71,160.71,0,0,1,142.1,96.3a172.58,172.58,0,0,0-58.26-49A88.16,88.16,0,0,1,128,40ZM70.47,56.77A156.46,156.46,0,0,1,127,104.38,154,154,0,0,1,41.87,133.72,88.12,88.12,0,0,1,70.47,56.77ZM40,147.24a169.69,169.69,0,0,0,94.27-27.46c2.48,5.18,4.78,10.51,6.86,16A168.91,168.91,0,0,0,84,188.47,88.35,88.35,0,0,1,40,147.24ZM128,216a88.13,88.13,0,0,1-33.82-6.73,152.79,152.79,0,0,1,50.77-47.53,165,165,0,0,1,18.42,50A87.71,87.71,0,0,1,128,216Zm49.77-11.45A178.6,178.6,0,0,0,161.4,158a154.68,154.68,0,0,1,54.21,8A88.31,88.31,0,0,1,177.77,204.55Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Demo / Start Free Modal */}
      {demoModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setDemoModalOpen(false)}
        >
          <div 
            className="bg-[#0e141b] border border-white/10 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-[#2dd4bf] to-[#e879f9] grid place-items-center mb-4">
              <svg className="w-6 h-6 text-[#0b0f14]" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Ready to create your coverflow?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Use keyboard ArrowLeft/ArrowRight or click any card and pill dot on the live 3D stage.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#e879f9] text-[#0b0f14] font-bold text-sm hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                Continue exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
