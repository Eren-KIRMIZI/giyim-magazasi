import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon = "search",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  const action = onAction ? (
    <button
      type="button"
      onClick={onAction}
      className="inline-block border border-on-surface px-8 py-3 font-headline-md text-headline-md uppercase hover:bg-on-surface hover:text-surface active:translate-y-0.5 transition-all duration-200"
    >
      {actionLabel}
    </button>
  ) : actionHref ? (
    <Link
      href={actionHref}
      className="inline-block bg-on-surface text-surface px-8 py-3 font-headline-md text-headline-md uppercase hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
    >
      {actionLabel}
    </Link>
  ) : null;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-stack-md text-center px-margin-mobile py-stack-lg min-h-[50vh] ${className}`}
    >
      <div className="w-16 h-16 border border-on-surface bg-surface-container flex items-center justify-center text-on-surface-variant">
        <Icon name={icon} className="w-8 h-8" />
      </div>
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
        {title}
      </h1>
      {description && (
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
