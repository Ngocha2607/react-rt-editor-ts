import * as React from 'react';
type PlatformShortcuts = Record<string, string>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  showTooltip?: boolean;
  tooltip?: React.ReactNode;
  shortcutKeys?: string;
}

export const MAC_SYMBOLS: PlatformShortcuts = {
  ctrl: '⌘',
  alt: '⌥',
  shift: '⇧',
} as const;

export const formatShortcutKey = (key: string, isMac: boolean) => {
  if (isMac) {
    const lowerKey = key.toLowerCase();
    return MAC_SYMBOLS[lowerKey] || key.toUpperCase();
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
};

export const parseShortcutKeys = (
  shortcutKeys: string | undefined,
  isMac: boolean,
) => {
  if (!shortcutKeys) return [];

  return shortcutKeys
    .split('-')
    .map((key) => key.trim())
    .map((key) => formatShortcutKey(key, isMac));
};

export const ShortcutDisplay: React.FC<{ shortcuts: string[] }> = ({
  shortcuts,
}) => {
  if (shortcuts.length === 0) return null;

  return (
    <div>
      {shortcuts.map((key, index) => (
        <div key={index}>
          {index > 0 && <kbd>+</kbd>}
          <kbd>{key}</kbd>
        </div>
      ))}
    </div>
  );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      children,
      tooltip,
      showTooltip = true,
      shortcutKeys,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={`tiptap-button ${className}`.trim()}
        ref={ref}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
