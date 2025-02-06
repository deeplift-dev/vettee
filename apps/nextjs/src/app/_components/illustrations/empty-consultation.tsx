export const EmptyConsultationIllustration = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`scale-50 fill-gray-700/30 ${className ?? ""}`}
    >
      <defs>
        <linearGradient
          id="clipboardGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgb(75, 85, 99)" stopOpacity="0.4" />
          <stop
            offset="100%"
            stopColor="rgb(107, 114, 128)"
            stopOpacity="0.2"
          />
        </linearGradient>
        <linearGradient id="linesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(75, 85, 99)" stopOpacity="0.4" />
          <stop
            offset="100%"
            stopColor="rgb(107, 114, 128)"
            stopOpacity="0.2"
          />
        </linearGradient>
        <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(147, 197, 253)" stopOpacity="0.1" />
          <stop
            offset="25%"
            stopColor="rgb(147, 197, 253)"
            stopOpacity="0.08"
          />
          <stop
            offset="50%"
            stopColor="rgb(147, 197, 253)"
            stopOpacity="0.05"
          />
          <stop
            offset="75%"
            stopColor="rgb(147, 197, 253)"
            stopOpacity="0.02"
          />
          <stop offset="100%" stopColor="rgb(147, 197, 253)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background gradient blob */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#blobGradient)"
        className="animate-pulse"
      />

      {/* Empty clipboard base with gradient */}
      <rect
        x="50"
        y="30"
        width="100"
        height="140"
        rx="10"
        fill="url(#clipboardGradient)"
      />
      <rect
        x="60"
        y="40"
        width="80"
        height="120"
        className="fill-gray-600/30"
      />

      {/* Clipboard top with gradient */}
      <rect
        x="85"
        y="20"
        width="30"
        height="20"
        rx="5"
        fill="url(#clipboardGradient)"
      />

      {/* Empty state lines with gradient */}
      <line
        x1="70"
        y1="60"
        x2="130"
        y2="60"
        stroke="url(#linesGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-gray-600/30"
      />
      <line
        x1="70"
        y1="80"
        x2="130"
        y2="80"
        stroke="url(#linesGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-gray-600/30"
      />
      <line
        x1="70"
        y1="100"
        x2="110"
        y2="100"
        stroke="url(#linesGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-gray-600/30"
      />

      {/* Question mark with gradient */}
      <text
        x="100"
        y="140"
        textAnchor="middle"
        fontSize="40"
        fill="url(#clipboardGradient)"
      >
        ?
      </text>
    </svg>
  );
};
