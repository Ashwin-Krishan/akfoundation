// Line icons drawn on one 24px grid with a shared stroke, so they read as a set.
type IconProps = { size?: number; className?: string };

function Svg({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10.25 9.25v5.5L14.75 12z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.1" cy="6.9" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.75 7 8.25 6 8.25-6" />
    </Svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className}
    >
      <path d="M8.5 5.75v12.5a.75.75 0 0 0 1.14.64l10-6.25a.75.75 0 0 0 0-1.28l-10-6.25a.75.75 0 0 0-1.14.64Z" fill="currentColor" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7M9 7h8v8" />
    </Svg>
  );
}
