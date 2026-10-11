function Logo({ size = 34, withText = true, light = false }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        role="img"
        aria-label="JobPortal logo"
      >
        <defs>
          <linearGradient id="jp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3B6CF6" />
            <stop offset="1" stopColor="#1E3FB8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#jp-grad)" />
        <path
          d="M20 8v9.5a5 5 0 0 1-10 0"
          fill="none"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="9.5" r="2" fill="#2DD4BF" />
      </svg>
      {withText && (
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            color: light ? "#fff" : "var(--jp-ink)",
          }}
        >
          Job
          <span style={{ color: light ? "#9db7ff" : "var(--jp-primary)" }}>
            Portal
          </span>
        </span>
      )}
    </span>
  );
}

export default Logo;
