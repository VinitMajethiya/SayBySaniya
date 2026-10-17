import React from 'react';
import { Doodle } from '@/components/brand/Doodle';

interface TinIllustrationProps {
  flavor: string;
  accent?: string;
  isOpen?: boolean;
  className?: string;
}

export const TinIllustration: React.FC<TinIllustrationProps> = ({
  flavor,
  accent = 'strawberry',
  isOpen = true,
  className = '',
}) => {
  const normFlavor = flavor.toLowerCase();

  // Real label colors from physical packaging:
  // Honey Butter label accent roughly #E9B76A
  // Vanilla Silk label tint roughly #D6D4EE
  // Strawberry label color is not photographed yet, so use pink token and flag it [confirm]
  let labelAccentColor = accent === 'strawberry' ? '#F0A8BE' : (accent || '#F0A8BE'); // Strawberry [confirm with owner]
  let flavorDisplayName = 'STRAWBERRY JAM';

  if (normFlavor.includes('honey')) {
    labelAccentColor = '#E9B76A';
    flavorDisplayName = 'HONEY BUTTER';
  } else if (normFlavor.includes('vanilla')) {
    labelAccentColor = '#8A84C8'; // Deep lavender text for contrast on white
    flavorDisplayName = 'VANILLA SILK';
  }

  // Soft cream balm color without photo cast
  const softCreamBalmFill = '#FAF4E5';

  const renderSquareIllustration = () => {
    if (normFlavor.includes('honey')) {
      return (
        <g transform="translate(154, 82)">
          {/* Tan square base */}
          <rect width="52" height="52" rx="4" fill="#F4E7CE" stroke="var(--ink)" strokeWidth="0.8" />
          {/* Honey pot */}
          <path
            d="M17 22 C17 18 35 18 35 22 L37 38 C37 43 15 43 15 38 Z"
            fill="#E9B76A"
            stroke="var(--ink)"
            strokeWidth="1.2"
          />
          {/* Honey pot rim */}
          <ellipse cx="26" cy="21" rx="10" ry="3.5" fill="#FAF6EE" stroke="var(--ink)" strokeWidth="1" />
          {/* Honey pot label band */}
          <path d="M16 28 Q26 31 36 28 L35.5 33 Q26 36 16.5 33 Z" fill="#FAF6EE" />
          {/* Dipper stick */}
          <line x1="33" y1="13" x2="25" y2="25" stroke="#7A5229" strokeWidth="2" strokeLinecap="round" />
          <circle cx="34" cy="12" r="3" fill="#D4A359" stroke="var(--ink)" strokeWidth="0.8" />
          {/* Golden drip */}
          <circle cx="26" cy="31" r="1.5" fill="#FAF6EE" />
        </g>
      );
    }

    if (normFlavor.includes('vanilla')) {
      return (
        <g transform="translate(154, 82)">
          {/* Lavender square base */}
          <rect width="52" height="52" rx="4" fill="#D6D4EE" stroke="var(--ink)" strokeWidth="0.8" />
          {/* Vanilla pods */}
          <path
            d="M12 44 Q28 26 40 10"
            stroke="#4A3728"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M18 46 Q32 30 44 14"
            stroke="#38251B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Vanilla flower petals */}
          <circle cx="26" cy="27" r="7" fill="#FDFBF4" stroke="var(--ink)" strokeWidth="0.9" />
          <circle cx="20" cy="24" r="5" fill="#FAF7EC" stroke="var(--ink)" strokeWidth="0.8" />
          <circle cx="32" cy="24" r="5" fill="#FAF7EC" stroke="var(--ink)" strokeWidth="0.8" />
          <circle cx="22" cy="32" r="5" fill="#FAF7EC" stroke="var(--ink)" strokeWidth="0.8" />
          <circle cx="30" cy="32" r="5" fill="#FAF7EC" stroke="var(--ink)" strokeWidth="0.8" />
          <circle cx="26" cy="27" r="2.5" fill="#E9B76A" />
        </g>
      );
    }

    // Default: Strawberry on pink square
    return (
      <g transform="translate(154, 82)">
        {/* Pink square base */}
        <rect width="52" height="52" rx="4" fill="#FCE9F0" stroke="var(--ink)" strokeWidth="0.8" />
        {/* Strawberry body */}
        <path
          d="M26 16 C38 16 44 28 37 41 C32 49 20 49 15 41 C8 28 14 16 26 16 Z"
          fill="#E85876"
          stroke="var(--ink)"
          strokeWidth="1.2"
        />
        {/* Green calyx/leaves */}
        <path
          d="M26 16 C22 10 16 12 14 14 C18 16 22 16 26 16 Z"
          fill="#4F7A5A"
          stroke="var(--ink)"
          strokeWidth="0.8"
        />
        <path
          d="M26 16 C30 10 36 12 38 14 C34 16 30 16 26 16 Z"
          fill="#4F7A5A"
          stroke="var(--ink)"
          strokeWidth="0.8"
        />
        <path d="M26 16 L26 9" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Golden seeds */}
        <circle cx="22" cy="26" r="0.9" fill="#FFF2B2" />
        <circle cx="30" cy="28" r="0.9" fill="#FFF2B2" />
        <circle cx="20" cy="35" r="0.9" fill="#FFF2B2" />
        <circle cx="27" cy="38" r="0.9" fill="#FFF2B2" />
        <circle cx="32" cy="35" r="0.9" fill="#FFF2B2" />
      </g>
    );
  };

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
        {/* Soft shadow under tin */}
        <ellipse
          cx="160"
          cy={isOpen ? "270" : "262"}
          rx="72"
          ry="14"
          fill="rgba(26,26,26,0.08)"
          className="transition-all duration-300"
        />

        {/* Silver Slider Tin Base (Bottom Tray) */}
        <rect
          x="88"
          y="36"
          width="144"
          height="228"
          rx="18"
          fill="#CFD0D3"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />

        {/* Silver Tray Inner Wall */}
        <rect
          x="94"
          y="42"
          width="132"
          height="216"
          rx="14"
          fill="#BEBFC2"
          stroke="var(--ink)"
          strokeWidth="0.8"
        />

        {/* Rivet near the top of the tin */}
        <g transform="translate(160, 48)">
          <circle cx="0" cy="0" r="4" fill="#A8A9AC" stroke="var(--ink)" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.8" fill="#E4E5E7" />
          <circle cx="-0.8" cy="-0.8" r="0.7" fill="#FFFFFF" />
        </g>

        {/* Balm Well (Revealed at top when lid slides down) */}
        {isOpen && (
          <g className="animate-in fade-in duration-300">
            {/* Cavity depression */}
            <rect
              x="99"
              y="58"
              width="122"
              height="80"
              rx="12"
              fill="#AFAFB2"
            />
            {/* Cream balm poured into well */}
            <rect
              x="101"
              y="60"
              width="118"
              height="76"
              rx="10"
              fill={softCreamBalmFill}
              stroke="var(--ink)"
              strokeWidth="1.2"
            />
            {/* Silky glossy shine curve on balm surface */}
            <path
              d="M108 72 Q160 64 212 72"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M112 80 Q160 74 196 80"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>
        )}

        {/* Sliding Lid */}
        <g
          transform={isOpen ? 'translate(0, 68)' : 'translate(0, 0)'}
          className="transition-transform duration-300 ease-out"
        >
          {/* Lid outer silver tin */}
          <rect
            x="86"
            y="34"
            width="148"
            height="232"
            rx="18"
            fill="#E2E3E6"
            stroke="var(--ink)"
            strokeWidth="1.6"
          />

          {/* Lid pressed edge highlight */}
          <rect
            x="90"
            y="38"
            width="140"
            height="224"
            rx="15"
            fill="#EDECEE"
          />

          {/* White Rectangular Label with thin black border */}
          <rect
            x="97"
            y="48"
            width="126"
            height="204"
            rx="6"
            fill="#FFFFFF"
            stroke="var(--ink)"
            strokeWidth="0.9"
          />

          {/* Inner hairline border on label */}
          <rect
            x="100"
            y="51"
            width="120"
            height="198"
            rx="4"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            opacity="0.3"
          />

          {/* Vertical Instagram Handle @saylipss.co at left edge */}
          <text
            x="106"
            y="150"
            transform="rotate(-90 106 150)"
            textAnchor="middle"
            fontFamily="'DM Sans', sans-serif"
            fontSize="5.2"
            letterSpacing="0.16em"
            fontWeight="500"
            fill="var(--ink-soft)"
          >
            @SAYLIPSS.CO
          </text>

          {/* Vertical Brand: "SAY BY SANIYA" with tiny script S */}
          <g transform="translate(122, 150) rotate(-90)">
            <text
              textAnchor="middle"
              fontFamily="'DM Sans', sans-serif"
              fontSize="6.8"
              letterSpacing="0.22em"
              fontWeight="700"
              fill="var(--ink)"
            >
              <tspan fontFamily="'Alex Brush', cursive" fontSize="12" fontWeight="400" dy="1">
                S
              </tspan>
              <tspan dy="-1">AY BY SANIYA</tspan>
            </text>
          </g>

          {/* Vertical Flavor Name in the flavor's accent color */}
          <text
            x="138"
            y="150"
            transform="rotate(-90 138 150)"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.14em"
            fill={labelAccentColor}
          >
            {flavorDisplayName}
          </text>

          {/* Small Square Illustration */}
          {renderSquareIllustration()}

          {/* Tiny Type on Label */}
          <g transform="translate(180, 154)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="'DM Sans', sans-serif"
              fontSize="6.8"
              letterSpacing="0.18em"
              fontWeight="700"
              fill="var(--ink)"
            >
              LIP BALM
            </text>

            <text
              x="0"
              y="11"
              textAnchor="middle"
              fontFamily="'DM Sans', sans-serif"
              fontSize="4.8"
              letterSpacing="0.16em"
              fontWeight="500"
              fill="var(--ink-soft)"
            >
              NOURISH. TINT. LOVE
            </text>

            <line x1="-22" y1="18" x2="22" y2="18" stroke="var(--ink)" strokeWidth="0.5" opacity="0.4" />

            <text
              x="0"
              y="26"
              textAnchor="middle"
              fontFamily="'DM Sans', sans-serif"
              fontSize="4.2"
              letterSpacing="0.14em"
              fontWeight="700"
              fill="var(--ink)"
            >
              100% ORGANIC &amp; HOMEMADE
            </text>
          </g>

          {/* Subtle bottom rivet / stop marker on lid */}
          <circle cx="160" cy="242" r="1.8" fill="#B0B1B4" stroke="var(--ink)" strokeWidth="0.6" />
        </g>
      </svg>

      {/* Tiny signature caption for 100% Organic & Homemade (balm label only) */}
      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none">
        <Doodle name="heart" size={10} className="text-heart" />
        <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.2em] text-ink">
          100% Organic &amp; Homemade
        </span>
      </div>
    </div>
  );
};
