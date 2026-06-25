import React from 'react';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  size?: InputSize;
  status?: InputStatus;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isRequired?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      size = 'md',
      status = 'default',
      leftElement,
      rightElement,
      isRequired,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = errorText ? `${inputId}-error` : undefined;
    const effectiveStatus = errorText ? 'error' : status;

    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {isRequired && <span className={styles.required} aria-hidden="true"> *</span>}
          </label>
        )}

        <div className={[styles.inputWrapper, styles[`size-${size}`], styles[`status-${effectiveStatus}`]].join(' ')}>
          {leftElement && <span className={styles.adornment}>{leftElement}</span>}

          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-required={isRequired}
            aria-invalid={effectiveStatus === 'error'}
            aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
            {...props}
          />

          {rightElement && <span className={[styles.adornment, styles.adornmentRight].join(' ')}>{rightElement}</span>}
        </div>

        {errorText && (
          <span id={errorId} className={styles.errorText} role="alert">
            {errorText}
          </span>
        )}
        {!errorText && helperText && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
