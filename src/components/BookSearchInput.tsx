// components/BookSearchInput.tsx
import React from 'react';

export type BookSearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export const BookSearchInput = React.forwardRef<HTMLInputElement, BookSearchInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="flex items-center min-w-96 bg-foreground rounded-md overflow-hidden">
        {icon && <div className="p-1">{icon}</div>}
        <input
          ref={ref}
          className={`flex-1 bg-white w-inherit focus:outline-none px-2 py-1 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

BookSearchInput.displayName = "BookSearchInput";

export default BookSearchInput;
