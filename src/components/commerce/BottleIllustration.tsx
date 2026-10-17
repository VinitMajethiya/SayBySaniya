import React from 'react';

interface BottleIllustrationProps {
  productType?: 'lip-tint' | 'lip-gloss';
  flavor?: string;
  accent?: string;
  isOpen?: boolean;
  className?: string;
}

export const BottleIllustration: React.FC<BottleIllustrationProps> = ({
  productType,
  flavor = '',
  accent = '',
  isOpen = false,
  className = '',
}) => {
  // Determine whether this bottle is Lip Tint or Lip Gloss
  const isTint =
    productType === 'lip-tint' ||
    accent === 'blood' ||
    flavor.toLowerCase().includes('blood') ||
    flavor.toLowerCase().includes('tint');

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
          {/* Deep Wine-Red Liquid Gradient (Nearly black in glass, deep garnet at edges) */}
          <linearGradient id="tintLiquid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2A050A" />
            <stop offset="35%" stopColor="#550E18" />
            <stop offset="65%" stopColor="#6E1320" />
            <stop offset="100%" stopColor="#250408" />
          </linearGradient>

          {/* Clear Gloss Liquid Gradient (Luminous clear refraction with bright highlight) */}
          <linearGradient id="glossLiquid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EDECE8" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#FAF7F2" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E4E3DE" stopOpacity="0.85" />
          </linearGradient>

          {/* Glass reflection gradient */}
          <linearGradient id="bottleSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Shadow under bottle */}
        <ellipse
          cx="160"
          cy="268"
          rx="58"
          ry="13"
          fill="rgba(26,26,26,0.08)"
          className="transition-all duration-300"
        />

        {/* ======================================================== */}
        {/* SHORT CLEAR THICK-GLASS BOTTLE BASE */}
        {/* ======================================================== */}
        <g transform="translate(0, 0)">
          {/* Bottle Collar / Neck */}
          <rect
            x="142"
            y="136"
            width="36"
            height="18"
            rx="3"
            fill="#EBECEF"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />

          {/* Clear Thick Glass Outer Body */}
          <rect
            x="108"
            y="150"
            width="104"
            height="112"
            rx="14"
            fill="#F6F6F7"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />

          {/* Liquid Chamber Inside Bottle */}
          <rect
            x="118"
            y="156"
            width="84"
            height="74"
            rx="7"
            fill={isTint ? 'url(#tintLiquid)' : 'url(#glossLiquid)'}
            stroke="var(--ink)"
            strokeWidth="1"
          />

          {/* Liquid Meniscus Curve at Top */}
          <ellipse
            cx="160"
            cy="158"
            rx="40"
            ry="4"
            fill={isTint ? '#841827' : '#FFFFFF'}
            opacity={isTint ? 0.8 : 0.9}
          />

          {/* Wand Stem Submerged Inside Liquid (when capped) */}
          {!isOpen && (
            <g opacity={isTint ? 0.35 : 0.85}>
              <line
                x1="160"
                y1="140"
                x2="160"
                y2="215"
                stroke={isTint ? '#1A0407' : '#C5C6C9'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Doe-foot applicator silhouette */}
              <polygon
                points="158,212 162,212 165,224 157,222"
                fill={isTint ? '#150204' : '#E0E1E4'}
              />
            </g>
          )}

          {/* High-Gloss Highlights on Clear Gloss fill */}
          {!isTint && (
            <g>
              <path
                d="M125 165 Q135 195 130 220"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle cx="178" cy="178" r="3" fill="#FFFFFF" opacity="0.8" />
              <circle cx="182" cy="195" r="2" fill="#FFFFFF" opacity="0.6" />
            </g>
          )}

          {/* Wine-Red Highlights on Lip Tint fill */}
          {isTint && (
            <g>
              <path
                d="M124 165 Q128 190 126 215"
                stroke="#B52C3D"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M192 170 Q194 190 191 210"
                stroke="#961C2C"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
            </g>
          )}

          {/* Thick Solid Glass Bottom Base */}
          <path
            d="M109 230 L211 230 L211 250 C211 257 203 261 194 261 L126 261 C117 261 109 257 109 250 Z"
            fill="#E9EAED"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />

          {/* Heavy Glass Bottom Internal Horizon Line */}
          <line
            x1="116"
            y1="233"
            x2="204"
            y2="233"
            stroke="var(--ink)"
            strokeWidth="0.8"
            opacity="0.6"
          />

          {/* Embossed in Script on Thick Glass Base: "Say By Saniya" */}
          <text
            x="160"
            y="249"
            textAnchor="middle"
            fontFamily="'Alex Brush', cursive"
            fontSize="13"
            fill="var(--ink)"
            letterSpacing="0.05em"
          >
            Say By Saniya
          </text>

          {/* Outer Glass Surface Sheen */}
          <rect
            x="110"
            y="152"
            width="100"
            height="108"
            rx="12"
            fill="url(#bottleSheen)"
            pointerEvents="none"
          />
          {/* Crisp Vertical Glass Reflection Streak */}
          <line
            x1="120"
            y1="156"
            x2="120"
            y2="252"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* ======================================================== */}
        {/* WHITE MATTE FACETED (HEXAGONAL) CAP & WAND */}
        {/* ======================================================== */}
        {/*
          Capped State: Cap mounted securely on the bottle collar
          Cap Off State: Cap and wand lifted and angled to show applicator tip
        */}
        <g
          transform={
            isOpen
              ? 'translate(198, 48) rotate(22)'
              : 'translate(160, 96)'
          }
          className="transition-transform duration-300 ease-out"
        >
          {/* Wand Stem + Doe-Foot Tip (Shown extending downward when cap is off) */}
          {isOpen && (
            <g className="animate-in fade-in duration-300">
              {/* Wand stem */}
              <rect
                x="-2"
                y="52"
                width="4"
                height="80"
                rx="2"
                fill="#D8D9DC"
                stroke="var(--ink)"
                strokeWidth="1"
              />
              {/* Stem highlight */}
              <line
                x1="-0.5"
                y1="54"
                x2="-0.5"
                y2="128"
                stroke="#FFFFFF"
                strokeWidth="1"
                opacity="0.8"
              />

              {/* Plush Doe-Foot Applicator Tip */}
              <polygon
                points="-4.5,130 4.5,130 6.5,145 -1.5,148 -4.5,142"
                fill={isTint ? '#8B1A1A' : '#F6F5F2'}
                stroke="var(--ink)"
                strokeWidth="1.2"
              />
              {/* Product droplet / shine on wand tip */}
              {isTint ? (
                <path
                  d="M1 146 C1 146 5 154 3 158 C1 161 -3 160 -3 156 C-3 152 1 146 1 146 Z"
                  fill="#8B1A1A"
                  stroke="var(--ink)"
                  strokeWidth="0.8"
                />
              ) : (
                <path
                  d="M1 146 C1 146 5 154 3 158 C1 161 -3 160 -3 156 C-3 152 1 146 1 146 Z"
                  fill="#FFFFFF"
                  stroke="var(--ink)"
                  strokeWidth="0.8"
                  opacity="0.85"
                />
              )}
            </g>
          )}

          {/* White Matte Faceted Cap Body */}
          <g transform="translate(0, 0)">
            {/* Outer Cap Contour */}
            <rect
              x="-24"
              y="-10"
              width="48"
              height="64"
              rx="4"
              fill="#F9F9FA"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />

            {/* Faceted Vertical Panels (Hexagonal Facets with soft matte shading) */}
            {/* Facet 1 (Left edge) */}
            <rect
              x="-23"
              y="-9"
              width="10"
              height="62"
              fill="#ECECEF"
              stroke="var(--ink)"
              strokeWidth="0.5"
            />
            {/* Facet 2 (Center Left) */}
            <rect
              x="-13"
              y="-9"
              width="13"
              height="62"
              fill="#F8F8FA"
              stroke="var(--ink)"
              strokeWidth="0.5"
            />
            {/* Facet 3 (Center Right) */}
            <rect
              x="0"
              y="-9"
              width="13"
              height="62"
              fill="#FFFFFF"
              stroke="var(--ink)"
              strokeWidth="0.5"
            />
            {/* Facet 4 (Right edge) */}
            <rect
              x="13"
              y="-9"
              width="10"
              height="62"
              fill="#EAEAEF"
              stroke="var(--ink)"
              strokeWidth="0.5"
            />

            {/* Thin Seam Line where cap meets the base */}
            <line
              x1="-24"
              y1="52"
              x2="24"
              y2="52"
              stroke="var(--ink)"
              strokeWidth="1.2"
            />

            {/* Subtle top chamfer */}
            <line
              x1="-22"
              y1="-8"
              x2="22"
              y2="-8"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.9"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
