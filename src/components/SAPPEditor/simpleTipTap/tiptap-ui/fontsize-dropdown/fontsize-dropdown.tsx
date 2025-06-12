import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { Select } from 'antd';

const FontSizeDropdown = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const sizesOptions = [
    '8px',
    '10px',
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '22px',
    '24px',
    '32px',
    '48px',
  ];
  const currentFontSize = editor?.getAttributes('textStyle').fontSize;
  const fontSizeOptions = sizesOptions.map((size) => ({
    label: size,
    value: size,
  }));
  const activeFont =
    fontSizeOptions.find((option) => {
      return option.value === currentFontSize;
    })?.value || '14px';

  const handleChangeFontSize = (value: string) => {
    editor?.chain().focus().setFontSize(value).run();
  };

  return (
    <Select
      style={{ width: 80 }}
      value={activeFont || undefined}
      onChange={handleChangeFontSize}
      options={sizesOptions.map((size) => ({
        label: size,
        value: size,
      }))}
    />
  );
};
export default FontSizeDropdown;
