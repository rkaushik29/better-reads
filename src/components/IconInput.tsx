import React from 'react';

export type IconInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export const IconInput: React.FC<IconInputProps> = ({ icon, className, ...props }) => {
  return (
    <div className="flex items-center border border-input bg-background rounded-md overflow-hidden">
      {icon && <div className="p-1">{icon}</div>}
      <input
        className={`flex-1 bg-transparent focus:outline-none px-2 py-1 ${className}`}
        {...props}
      />
    </div>
  );
};

export default IconInput;
