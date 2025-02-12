export const NewConsultIcon = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 48 48" className={`h-full w-full ${className ?? ""}`}>
      <defs>
        <linearGradient id="formGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(71, 85, 105)" stopOpacity="0.4" />
          <stop
            offset="100%"
            stopColor="rgb(100, 116, 139)"
            stopOpacity="0.2"
          />
        </linearGradient>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(71, 85, 105)" stopOpacity="0.4" />
          <stop
            offset="100%"
            stopColor="rgb(100, 116, 139)"
            stopOpacity="0.2"
          />
        </linearGradient>
      </defs>

      {/* Form background */}
      <rect
        x="8"
        y="8"
        width="32"
        height="32"
        rx="4"
        fill="url(#formGradient)"
        className="animate-pulse"
      />

      {/* Form lines */}
      <line
        x1="14"
        y1="16"
        x2="34"
        y2="16"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-slate-500/30"
      />
      <line
        x1="14"
        y1="24"
        x2="34"
        y2="24"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-slate-500/30"
      />
      <line
        x1="14"
        y1="32"
        x2="26"
        y2="32"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-slate-500/30"
      />

      {/* Plus symbol */}
      <circle
        cx="38"
        cy="38"
        r="6"
        fill="url(#formGradient)"
        className="animate-pulse"
      />
      <line
        x1="35"
        y1="38"
        x2="41"
        y2="38"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="38"
        y1="35"
        x2="38"
        y2="41"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
