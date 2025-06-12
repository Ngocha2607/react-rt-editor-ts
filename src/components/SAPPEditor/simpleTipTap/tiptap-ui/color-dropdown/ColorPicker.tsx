import React from 'react';
import { Editor } from '@tiptap/react';

import { ChangeEvent } from 'react';

const classes = {
  color: {
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    '&::WebkitColorSwatch': {
      borderRadius: 4,
      border: 'none',
    },
    '&::MozColorSwatch': {
      borderRadius: 4,
      border: 'none',
    },
  },
};
type Props = {
  editor: Editor;
};
const ColorPicker = ({ editor }: Props) => {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  return (
    <div className="flexRow center stretchSelf">
      <input
        type="color"
        onInput={handleInput}
        value={editor.getAttributes('textStyle').color}
        style={classes.color}
      />
    </div>
  );
};

export default ColorPicker;
