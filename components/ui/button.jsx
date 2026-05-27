import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const variants = {
  default:     "bg-[#111827] text-white shadow-sm hover:bg-[#1f2937]",
  secondary:   "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
  outline:     "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-gray-900",
  ghost:       "hover:bg-gray-100 text-gray-700",
  destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
  link:        "text-[#2563EB] underline-offset-4 hover:underline",
};

const sizes = {
  default: "h-9 px-4 py-2 text-sm",
  sm:      "h-8 rounded-md px-3 text-xs",
  lg:      "h-11 rounded-md px-8 text-base",
  icon:    "h-9 w-9",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
