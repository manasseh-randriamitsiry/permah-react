import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-md border-0 shadow-sm text-lg py-3 px-4',
            'focus:border-blue-50 focus:ring-blue-50',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          id={id}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);