import React from 'react';

interface JarIllustrationProps {
  isOpen?: boolean;
  className?: string;
  accent?: string;
}

export const JarIllustration: React.FC<JarIllustrationProps> = ({
  isOpen = false,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full aspect-square flex items-center justify-center p-3 bg-ivory/60 select-none overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full max-w-[280px] max-h-[280px] drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Gradient for Lid Edge */}
          <linearGradient id="goldRimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFB76C" />
            <stop offset="25%" stopColor="#FBF1D4" />
            <stop offset="50%" stopColor="#C69740" />
            <stop offset="75%" stopColor="#ECCF8B" />
            <stop offset="100%" stopColor="#B6852F" />
          </linearGradient>

          {/* Pale Blue-Grey Mask Gradient (#BFD3D0) */}
          <radialGradient id="maskFillGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#D5E4E2" />
            <stop offset="60%" stopColor="#BFD3D0" />
            <stop offset="100%" stopColor="#A8C0BC" />
          </radialGradient>

          {/* Glass reflection gradient */}
          <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Soft shadow under jar */}
        <ellipse
          cx="160"
          cy="252"
          rx={isOpen ? '88' : '78'}
          ry="18"
          fill="rgba(26,26,26,0.08)"
          className="transition-all duration-300"
        />

        {/* ======================================================== */}
        {/* CLEAR ROUND SHALLOW JAR BODY */}
        {/* ======================================================== */}
        <g transform="translate(0, 20)">
          {/* Outer Glass Contour */}
          <rect
            x="84"
            y="126"
            width="152"
            height="88"
            rx="20"
            fill="#F6F7F8"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />

          {/* Thick Glass Bottom Base */}
          <path
            d="M86 190 Q160 196 234 190 L234 196 C234 206 222 214 204 214 L116 214 C98 214 86 206 86 196 Z"
            fill="#EBECEF"
            stroke="var(--ink)"
            strokeWidth="1"
          />
          {/* Glass base reflection line */}
          <path
            d="M96 200 Q160 206 224 200"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Mask product visible through clear glass */}
          <rect
            x="94"
            y="134"
            width="132"
            height="58"
            rx="12"
            fill="url(#maskFillGradient)"
            stroke="var(--ink)"
            strokeWidth="1"
          />

          {/* Glass Sheen overlay */}
          <rect
            x="86"
            y="128"
            width="148"
            height="84"
            rx="18"
            fill="url(#glassSheen)"
            pointerEvents="none"
          />
          {/* Vertical gloss streak */}
          <line
            x1="104"
            y1="136"
            x2="104"
            y2="194"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Open Jar Top Rim Pool (visible when lid is off) */}
          {isOpen && (
            <g className="animate-in fade-in duration-300">
              {/* Glass threaded neck */}
              <ellipse
                cx="160"
                cy="126"
                rx="68"
                ry="18"
                fill="#E8ECEB"
                stroke="var(--ink)"
                strokeWidth="1.4"
              />
              {/* Pool of pale blue-grey mask visible inside */}
              <ellipse
                cx="160"
                cy="126"
                rx="62"
                ry="15"
                fill="url(#maskFillGradient)"
                stroke="var(--ink)"
                strokeWidth="1.1"
              />
              {/* Glossy liquid highlight on mask surface */}
              <path
                d="M115 124 Q160 118 205 124"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M125 129 Q160 124 195 129"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </g>
          )}
        </g>

        {/* ======================================================== */}
        {/* GOLD RIM LID + ROUND CREAM LABEL */}
        {/* ======================================================== */}
        {/*
          Closed State: Lid seated flat on top of the jar
          Open State: Lid tilted gracefully against the jar
        */}
        <g
          transform={
            isOpen
              ? 'translate(196, 126) rotate(26)'
              : 'translate(160, 134)'
          }
          className="transition-transform duration-300 ease-out"
        >
          {/* Lid Shadow (when tilted open) */}
          {isOpen && (
            <ellipse
              cx="0"
              cy="24"
              rx="58"
              ry="12"
              fill="rgba(26,26,26,0.12)"
            />
          )}

          {/* Gold Rim Lid Outer Edge (Metallic Gold) */}
          <ellipse
            cx="0"
            cy="0"
            rx="74"
            ry="22"
            fill="url(#goldRimGradient)"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />

          {/* Gold Rim Chamfer Edge */}
          <ellipse
            cx="0"
            cy="2"
            rx="72"
            ry="20"
            fill="none"
            stroke="#FFF5D8"
            strokeWidth="0.8"
            opacity="0.7"
          />

          {/* Round Cream Label on Top of Lid */}
          <ellipse
            cx="0"
            cy="-1"
            rx="62"
            ry="18"
            fill="#FAF6EE"
            stroke="var(--ink)"
            strokeWidth="1"
          />

          {/* Inner hairline ring on label */}
          <ellipse
            cx="0"
            cy="-1"
            rx="58"
            ry="16"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.6"
          />

          {/* Script "SAY" */}
          <text
            x="-16"
            y="2"
            textAnchor="middle"
            fontFamily="'Alex Brush', cursive"
            fontSize="18"
            fill="var(--ink)"
          >
            SAY
          </text>

          {/* "By Saniya" */}
          <text
            x="14"
            y="-1"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="7.5"
            fontWeight="600"
            letterSpacing="0.06em"
            fill="var(--ink)"
          >
            By Saniya
          </text>

          {/* "OVER NIGHT LIP MASK" in small caps */}
          <text
            x="0"
            y="9"
            textAnchor="middle"
            fontFamily="'DM Sans', sans-serif"
            fontSize="5.2"
            fontWeight="700"
            letterSpacing="0.18em"
            fill="var(--ink-soft)"
          >
            OVER NIGHT LIP MASK
          </text>
        </g>
      </svg>
    </div>
  );
};
