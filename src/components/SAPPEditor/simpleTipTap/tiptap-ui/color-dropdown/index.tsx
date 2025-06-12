import * as React from 'react';
import { Popover } from 'antd';
import { Editor } from '@tiptap/react';
import { ToolbarGroup } from '@components/SAPPEditor/tiptap-ui-primitive/toolbar';
import { Button } from '@components/SAPPEditor/tiptap-ui-primitive/button';
import { ColorIcon } from '../../tiptap-icons/color-icon';

interface ColorDropdownProps {
  editor: Editor | null;
}

const colors = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#00ffff',
  '#ff00ff',
  '#ffa500',
  '#800080',
  '#008000',
  '#808080',
  '#a52a2a',
  '#ffc0cb',
  '#000080',
];

const ColorDropdown: React.FC<ColorDropdownProps> = ({ editor }) => {
  const [open, setOpen] = React.useState(false);

  if (!editor) return null;

  const handleColorSelect = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setOpen(false);
  };

  const content = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        padding: '8px',
        width: '200px',
      }}
    >
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => handleColorSelect(color)}
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: color,
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        />
      ))}
    </div>
  );

  return (
    <ToolbarGroup>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
      >
        <Button
          data-style="ghost"
          //   isActive={editor.isActive('textStyle', { color: true })}
        >
          <ColorIcon className="tiptap-button-icon" />
        </Button>
      </Popover>
    </ToolbarGroup>
  );
};

export default ColorDropdown;
