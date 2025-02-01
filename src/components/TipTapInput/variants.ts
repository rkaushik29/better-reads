// variants.ts
import { cva } from 'class-variance-authority';

/**
 * Variants for the RichTextInput component.
 * You can customize these classes as needed.
 */
export const RichTextInputVariants = cva(
  'border rounded-md transition-all focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-white',
        inline: 'bg-transparent border-b-2',
      },
      errorMessage: {
        true: 'border-red-500 focus:ring-red-500',
        false: 'border-gray-300 focus:ring-blue-500',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
      readOnly: {
        true: 'bg-gray-100',
        false: '',
      },
      maxHeight: {
        true: 'max-h-96',
        false: '',
      },
      resizable: {
        true: 'resize',
        false: 'resize-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      errorMessage: false,
      disabled: false,
      readOnly: false,
      maxHeight: false,
      resizable: true,
    },
  }
);

/**
 * Variants for Table styling.
 */
export const TableVariants = cva('table-auto border-collapse w-full', {
  variants: {
    variant: {
      default: 'border-gray-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Variants for TableRow styling.
 */
export const TableRowVariants = cva('border-b border-gray-200', {
  variants: {
    variant: {
      default: 'border-gray-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Variants for TableCell styling.
 */
export const TableCellVariants = cva('p-2 border border-gray-300', {
  variants: {
    variant: {
      default: 'border-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Variants for TableHeader styling.
 */
export const TableHeaderVariants = cva(
  'p-2 border border-gray-300 bg-gray-50 font-semibold',
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-gray-50 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
