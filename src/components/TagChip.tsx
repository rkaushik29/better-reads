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
  "inline-flex items-center rounded-md font-medium transition-colors",
  {
    variants: {
      size: {
        sm: "px-1 py-0.5 text-xs",
        md: "px-2 py-1 text-sm",
      },
      color: {
        yellow: "bg-yellow-100 text-yellow-800",
        red: "bg-red-100 text-red-800",
        green: "bg-green-100 text-green-800",
        blue: "bg-blue-100 text-blue-800",
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
  const bgColor = `bg-${color}-100`;
  const textColor = `text-${color}-800`;

  return (
    <div
      className={clsx(tagChipVariants({ size, className }), bgColor, textColor)}
      {...props}
    >
      {label}
    </div>
  );
};

export default TagChip;
