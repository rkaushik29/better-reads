import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

export interface TagChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagChipVariants> {
  label: string;
  color: "yellow" | "red" | "green" | "blue";
}

const tagChipVariants = cva(
  "inline-flex items-center rounded-md font-medium transition-colors border-2",
  {
    variants: {
      size: {
        sm: "px-1 py-0.5 text-xs",
        md: "px-2 py-1 text-sm",
      },
      color: {
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-800",
        red: "bg-red-100 text-red-800 border-red-800",
        green: "bg-green-100 text-green-800 border-green-800",
        blue: "bg-blue-100 text-blue-800 border-blue-800",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const TagChip: React.FC<TagChipProps> = ({
  label,
  color,
  size,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(tagChipVariants({ size, color, className }))}
      {...props}
    >
      {label}
    </div>
  );
};

export default TagChip;
