// ported from gbthang - loading spinner - 2026-04-17
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullPage?: boolean;
}

const Spinner = ({ size = "md", label, fullPage = false }: SpinnerProps) => {
  const sizeMap: Record<string, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeMap[size]} rounded-full border-green-600 border-t-transparent animate-spin`}
        aria-label="Loading"
        role="status"
      />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default Spinner;
