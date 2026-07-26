import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: number | string;
  image: string;
  title?: string;
  subtitle?: string;
}

interface Props {
  slides: HeroSlide[];
  intervalMs?: number;
  children?: React.ReactNode;
}

/**
 * Reusable full-width hero image slider.
 * - Auto-advances every `intervalMs` (default 3s)
 * - Smooth fade transition
 * - Prev/Next buttons + pagination indicators
 * - Optional overlay content (CTA buttons etc.) via `children`
 *
 * Slide data is injected via props so an admin can later swap the source
 * (DB / CMS) without changing this component.
 */
export function HeroSlider({ slides, intervalMs = 3000, children }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [paused, count, intervalMs]);

  if (count === 0) return null;

  return (
    <section
      className="relative -mt-16 h-screen min-h-[560px] w-full overflow-hidden bg-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <img
            src={s.image}
            alt={s.title ?? ""}
            className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
              i === index ? "scale-105" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-24 sm:px-6 sm:pb-28 lg:items-center lg:px-8 lg:pb-0">
        <div key={index} className="max-w-2xl text-white">
          {slides[index].title && (
            <h1 className="hero-fade-up font-display text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              {slides[index].title}
            </h1>
          )}
          {slides[index].subtitle && (
            <p className="hero-fade-up-delay mt-5 max-w-xl text-base text-white/90 drop-shadow sm:text-lg md:text-xl text-pretty">
              {slides[index].subtitle}
            </p>
          )}
          {children && <div className="hero-fade-up-delay mt-8">{children}</div>}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 text-primary-foreground backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25 sm:left-6 sm:p-3.5"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 text-primary-foreground backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25 sm:right-6 sm:p-3.5"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-10 bg-primary-foreground shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    : "w-2 bg-primary-foreground/50 hover:w-4 hover:bg-primary-foreground/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
