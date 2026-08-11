import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3 transition">
      <div className="relative flex items-center justify-center">
        {/* SVG logo icon inspired by official AMARBN brand */}
        <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lime dots top */}
          <circle cx="20" cy="22" r="5" fill="#8cc63f" />
          <circle cx="35" cy="14" r="5.5" fill="#8cc63f" />
          <circle cx="52" cy="13" r="6" fill="#8cc63f" />
          <circle cx="70" cy="20" r="6.5" fill="#8cc63f" />

          {/* Orange swoosh ring */}
          <path
            d="M10 50 C25 22, 75 18, 90 35 C70 45, 30 52, 10 50 Z"
            fill="#f58220"
          />
          <path
            d="M90 52 C75 78, 25 82, 10 65 C30 55, 70 48, 90 52 Z"
            fill="#f58220"
          />

          {/* Blue text stylized background */}
          <text
            x="50%"
            y="58%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#1e65c9"
            stroke="#ffffff"
            strokeWidth="3"
            fontSize="26"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            AMARBN
          </text>

          {/* Lime dots bottom */}
          <circle cx="80" cy="78" r="5" fill="#8cc63f" />
          <circle cx="65" cy="86" r="5.5" fill="#8cc63f" />
          <circle cx="48" cy="87" r="6" fill="#8cc63f" />
          <circle cx="30" cy="80" r="6.5" fill="#8cc63f" />
        </svg>
      </div>

      <div>
        <span className={`block text-xl font-black tracking-tight leading-none ${light ? "text-white" : "text-[#0d363a]"}`}>
          AMARBN
        </span>
        <span className={`block pt-1 text-[8px] font-extrabold uppercase tracking-wider ${light ? "text-white/70" : "text-[#185e56]"}`}>
          Associação dos Moradores e Agricultores Rurais do Bairro do Nordeste
        </span>
      </div>
    </Link>
  );
}
