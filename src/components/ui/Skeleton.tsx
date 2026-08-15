export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-surface-container-high animate-pulse ${className}`}
    />
  );
}
