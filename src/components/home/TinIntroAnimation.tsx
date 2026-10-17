import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Doodle } from '@/components/brand/Doodle';

/**
 * INTRO_TIMING Configuration
 * Easily adjust animation phases here (in seconds).
 */
export const INTRO_TIMING = {
  OPEN_DELAY: 0.6, // Delay before lid starts sliding open (0.6s)
  OPEN_DURATION: 0.8, // Duration of the sliding lid animation (0.8s)
  REVEAL_PAUSE: 0.4, // Pause to appreciate the open balm well (0.4s)
  FADE_DURATION: 0.6, // Fade-out of the overlay revealing Home page (0.6s)
  SAFETY_TIMEOUT: 3.0, // Hard safety timeout to guarantee dismissal (3.0s)
};

const SESSION_STORAGE_KEY = 'sbs_intro_seen';

export const TinIntroAnimation: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Determine if intro should run
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    // If reduced motion is requested, immediately skip
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    // Check sessionStorage safely
    try {
      const alreadySeen = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (alreadySeen === 'true') {
        return false;
      }
    } catch {
      // Fallback if sessionStorage is blocked
      return false;
    }

    return true;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Dismiss handler
  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    setIsFinished(true);
    setShouldShow(false);
    document.body.style.overflow = '';
  }, []);

  // Main lifecycle & sequence
  useEffect(() => {
    if (!shouldShow || shouldReduceMotion) {
      setIsFinished(true);
      return;
    }

    // Lock page scroll during the intro
    document.body.style.overflow = 'hidden';

    // Step 1: Slide open the lid after OPEN_DELAY
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, INTRO_TIMING.OPEN_DELAY * 1000);

    // Step 2: Trigger fade-out & scale after opening + pause
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, (INTRO_TIMING.OPEN_DELAY + INTRO_TIMING.OPEN_DURATION + INTRO_TIMING.REVEAL_PAUSE) * 1000);

    // Step 3: Complete sequence and unmount
    const finishTimer = setTimeout(() => {
      dismiss();
    }, (INTRO_TIMING.OPEN_DELAY + INTRO_TIMING.OPEN_DURATION + INTRO_TIMING.REVEAL_PAUSE + INTRO_TIMING.FADE_DURATION) * 1000);

    // Step 4: Hard fallback safety timer
    const safetyTimer = setTimeout(() => {
      dismiss();
    }, INTRO_TIMING.SAFETY_TIMEOUT * 1000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      clearTimeout(safetyTimer);
      document.body.style.overflow = '';
    };
  }, [shouldShow, shouldReduceMotion, dismiss]);

  if (!shouldShow || isFinished) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        role="presentation"
        onClick={dismiss}
        initial={{ opacity: 1 }}
        animate={{
          opacity: isFading ? 0 : 1,
          scale: isFading ? 1.08 : 1,
        }}
        transition={{
          duration: INTRO_TIMING.FADE_DURATION,
          ease: [0.22, 1, 0.36, 1], // ease-brand from DESIGN.md
        }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream select-none cursor-pointer overflow-hidden"
        style={{ willChange: 'opacity, transform' }}
      >
        {/* Skip Button (Accessible button with minimum 44px tap target) */}
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
            aria-label="Skip intro animation and enter storefront"
            className="px-4 py-2 rounded-pill border border-hairline bg-ivory text-ink hover:text-heart hover:border-heart text-xs font-sans uppercase font-medium tracking-button shadow-xs transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center gap-1.5"
          >
            <span>Skip</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Ambient Floating Hearts when lid opens */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute pointer-events-none text-heart"
            >
              <div className="relative w-64 h-64">
                <motion.div
                  animate={{ y: [-10, -80], x: [0, -18], opacity: [0, 0.9, 0], scale: [0.6, 1.2, 0.9] }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute left-10 top-12"
                >
                  <Doodle name="heart" size={20} color="var(--heart)" className="fill-heart" />
                </motion.div>
                <motion.div
                  animate={{ y: [-5, -95], x: [0, 22], opacity: [0, 0.85, 0], scale: [0.5, 1, 0.8] }}
                  transition={{ duration: 1.4, delay: 0.15, ease: 'easeOut' }}
                  className="absolute right-12 top-8"
                >
                  <Doodle name="heart" size={16} color="var(--heart)" className="fill-heart" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Centered Slider Tin Hero Animation */}
        <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center p-4">
          <svg
            viewBox="0 0 320 320"
            className="w-full h-full max-w-[300px] max-h-[300px] drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Tin Drop Shadow */}
            <ellipse
              cx="160"
              cy="212"
              rx="95"
              ry="34"
              fill="rgba(26,26,26,0.08)"
            />

            {/* Slider Tin Base (Bottom Metallic Well) */}
            <rect
              x="75"
              y="105"
              width="160"
              height="98"
              rx="14"
              fill="var(--tin)"
              stroke="var(--ink)"
              strokeWidth="2"
            />

            {/* Balm Well with Strawberry Jam Pink (#F0A8BE / var(--strawberry)) */}
            <g>
              <rect
                x="83"
                y="113"
                width="72"
                height="82"
                rx="8"
                fill="var(--strawberry)"
                stroke="var(--ink)"
                strokeWidth="1.2"
              />
              {/* Glossy Organic Highlight */}
              <path
                d="M88 120 C95 116, 122 116, 134 120"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.45"
              />
            </g>

            {/* Sliding Lid with Framer Motion CSS Transform */}
            <motion.g
              initial={{ x: 0, y: 0 }}
              animate={{
                x: isOpen ? 56 : 0,
                y: isOpen ? -8 : 0,
              }}
              transition={{
                duration: INTRO_TIMING.OPEN_DURATION,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: 'transform' }}
            >
              {/* Metallic Lid Body */}
              <rect
                x="75"
                y="105"
                width="160"
                height="98"
                rx="14"
                fill="#E1E2E4"
                stroke="var(--ink)"
                strokeWidth="2"
              />

              {/* Embossed Cream Faceplate */}
              <rect
                x="81"
                y="111"
                width="148"
                height="86"
                rx="10"
                fill="#FAF6EE"
                stroke="var(--ink)"
                strokeWidth="1.2"
              />

              {/* Signature Black Ribbon Bow Doodle on Lid */}
              <path
                d="M151 123 C147 119, 142 120, 144 125 C146 127, 150 125, 151 124 Z"
                fill="var(--ink)"
              />
              <path
                d="M157 123 C161 119, 166 120, 164 125 C162 127, 158 125, 157 124 Z"
                fill="var(--ink)"
              />
              <circle cx="154" cy="124" r="1.8" fill="var(--ink)" />
              <path d="M152 126 c-2 3-4 6-6 7" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" />
              <path d="M156 126 c2 3 4 6 6 7" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" />

              {/* Eyebrow Label */}
              <text
                x="155"
                y="140"
                textAnchor="middle"
                fontFamily="'DM Sans', sans-serif"
                fontSize="7"
                letterSpacing="0.22em"
                fontWeight="600"
                fill="var(--ink)"
              >
                100% ORGANIC &amp; HOMEMADE
              </text>

              {/* Script Wordmark "Say By Saniya" */}
              <text
                x="155"
                y="158"
                textAnchor="middle"
                fontFamily="'Alex Brush', cursive"
                fontSize="18"
                fill="var(--ink)"
              >
                Say By Saniya
              </text>

              {/* Tagline */}
              <text
                x="155"
                y="172"
                textAnchor="middle"
                fontFamily="'Playfair Display', serif"
                fontStyle="italic"
                fontSize="7.5"
                fontWeight="500"
                fill="var(--ink)"
              >
                Nourish. Tint. Love.
              </text>

              {/* Handle */}
              <text
                x="155"
                y="184"
                textAnchor="middle"
                fontFamily="'DM Sans', sans-serif"
                fontSize="5"
                letterSpacing="0.1em"
                fontWeight="400"
                fill="var(--ink-soft)"
              >
                @saylipss.co
              </text>
            </motion.g>
          </svg>
        </div>

        {/* Tap Anywhere Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft text-center mt-2 pointer-events-none"
        >
          {isOpen ? 'Welcome to Say By Saniya ♥' : 'Opening your pocket tin…'}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};
