interface IconProps {
  name: IconName;
  className?: string;
  filled?: boolean;
}

export type IconName =
  | "search"
  | "person"
  | "favorite"
  | "shopping_bag"
  | "logout"
  | "menu"
  | "close"
  | "arrow_forward"
  | "check"
  | "flash_on"
  | "progress_activity"
  | "star"
  | "tune"
  | "light_mode"
  | "dark_mode";

const FILLED_ICONS: IconName[] = ["favorite", "star", "flash_on", "check"];

const PATHS: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="9.5" cy="9.5" r="5.5" />
      <line x1="13.6" y1="13.6" x2="21" y2="21" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4.5 20c1.2-3.4 4-5 7.5-5s6.3 1.6 7.5 5" />
    </>
  ),
  favorite: (
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  ),
  shopping_bag: (
    <>
      <path d="M7 7h10l1 13H6L7 7z" />
      <path d="M9 7a3 3 0 1 1 6 0" />
    </>
  ),
  logout: (
    <>
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M10 12h10" />
      <path d="M16 8l4 4-4 4" />
    </>
  ),
  menu: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  arrow_forward: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  check: <path d="M5 12l5 5L19 7" />,
  flash_on: (
    <path d="M7 2h10l-4 8h6l-9 12 3-8H7l2-12z" />
  ),
  progress_activity: <path d="M12 3a9 9 0 1 1-6.36 2.64" />,
  star: (
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  ),
  tune: (
    <>
      <path d="M3 6h8" />
      <circle cx="15.5" cy="6" r="2.5" />
      <path d="M3 12h3" />
      <circle cx="11" cy="12" r="2.5" />
      <path d="M17 12h4" />
      <path d="M3 18h8" />
      <circle cx="15.5" cy="18" r="2.5" />
    </>
  ),
  light_mode: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  dark_mode: (
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  ),
};

export function Icon({ name, className = "w-6 h-6", filled = false }: IconProps) {
  const useFill = filled || FILLED_ICONS.includes(name);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill={useFill ? "currentColor" : "none"}
      stroke={useFill ? "none" : "currentColor"}
      strokeWidth={useFill ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
