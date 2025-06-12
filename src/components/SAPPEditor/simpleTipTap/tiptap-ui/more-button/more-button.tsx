import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { useTiptapEditor } from 'src/hooks/use-tiptap-editor';
import {
  Button,
  ButtonProps,
} from '@components/SAPPEditor/tiptap-ui-primitive/button';
import { MoreIcon } from '../../tiptap-icons/more-icon';

/**
 * Props for the MoreButton component.
 */
export interface MoreButtonProps extends ButtonProps {
  /**
   * The TipTap editor instance.
   */
  editor?: Editor | null;
}

/**
 * Button component for triggering undo/redo actions in a TipTap editor.
 */
export const MoreButton = React.forwardRef<HTMLButtonElement, MoreButtonProps>(
  (
    {
      editor: providedEditor,
      className = '',
      disabled,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const editor = useTiptapEditor(providedEditor);

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
      },
      [onClick, disabled],
    );

    if (!editor || !editor.isEditable) {
      return null;
    }

    return (
      <Button
        ref={ref}
        type="button"
        className={className.trim()}
        disabled={disabled}
        data-style="ghost"
        data-disabled={disabled}
        role="button"
        tabIndex={-1}
        onClick={handleClick}
        {...buttonProps}
      >
        {children || (
          <React.Fragment>
            <MoreIcon className="tiptap-button-icon" />
          </React.Fragment>
        )}
      </Button>
    );
  },
);

MoreButton.displayName = 'MoreButton';

export default MoreButton;
