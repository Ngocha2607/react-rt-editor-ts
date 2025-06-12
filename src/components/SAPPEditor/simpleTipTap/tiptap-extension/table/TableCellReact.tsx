import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import Tippy from '@tippyjs/react';
import { ChevronDownIcon } from '@components/SAPPEditor/simpleTipTap/tiptap-icons/chevron-down-icon';

interface Props {
  node: any;
  getPos: () => number;
  editor: Editor;
  updateAttributes: (attributes: Record<string, any>) => void;
}

interface CellButton {
  name: string;
  action: (editor: Editor) => boolean;
  iconClass?: string;
}

const cellButtonsConfig: CellButton[] = [
  {
    name: 'Add row above',
    action: (editor) => editor.chain().focus().addRowBefore().run(),
  },
  {
    name: 'Add row below',
    action: (editor) => editor.chain().focus().addRowAfter().run(),
  },
  {
    name: 'Add column before',
    action: (editor) => editor.chain().focus().addColumnBefore().run(),
  },
  {
    name: 'Add column after',
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
  },
  {
    name: 'Remove row',
    action: (editor) => editor.chain().focus().deleteRow().run(),
  },
  {
    name: 'Remove column',
    action: (editor) => editor.chain().focus().deleteColumn().run(),
  },
  {
    name: 'Toggle header row',
    action: (editor) => editor.chain().focus().toggleHeaderRow().run(),
  },
  {
    name: 'Toggle header column',
    action: (editor) => editor.chain().focus().toggleHeaderColumn().run(),
  },
  {
    name: 'Toggle header cell',
    action: (editor) => editor.chain().focus().toggleHeaderCell().run(),
  },
  {
    name: 'Merge cells',
    action: (editor) => editor.chain().focus().mergeCells().run(),
  },
  {
    name: 'Split cell',
    action: (editor) => editor.chain().focus().splitCell().run(),
  },
  {
    name: 'Remove table',
    action: (editor) => editor.chain().focus().deleteTable().run(),
  },
];

const TableCellReact: React.FC<Props> = ({
  node,
  editor,
  updateAttributes,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const appendToDom = document.querySelector('.simple-editor-content');
  useEffect(() => {
    return () => {
      setShowDropdown(false);
    };
  }, []);

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleButtonClick = (action: (editor: Editor) => boolean) => {
    try {
      action(editor);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error executing table action:', error);
    }
  };

  const DropdownContent = () => (
    <article className="dropdown" contentEditable={false}>
      <div className="dropdown-content menu">
        <div className="dropdown-table-action">
          {cellButtonsConfig.map((btn, index) => (
            <button
              key={`${btn.name}-${index}`}
              className="dropdown-item"
              onClick={() => handleButtonClick(btn.action)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {btn.iconClass && <i className={btn.iconClass} />}
              <span>{btn.name}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );

  // **THAY ĐỔI QUAN TRỌNG**: Sử dụng div thay vì as="td"
  return (
    <NodeViewWrapper className="relative group">
      {/* Dropdown trigger button */}
      <div
        contentEditable={false}
        className="dropdown-button"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Tippy
          className={showDropdown ? '' : 'hidden'}
          visible={showDropdown}
          onClickOutside={() => setShowDropdown(false)}
          appendTo={appendToDom || document.body}
          trigger="manual"
          interactive={true}
          animation="shift-toward-subtle"
          placement="top-start"
          offset={[0, 4]}
          content={<DropdownContent />}
        >
          <button
            ref={buttonRef}
            // className="trigger-button"
            onClick={handleToggleDropdown}
            onMouseDown={(e) => e.preventDefault()}
            type="button"
          >
            <ChevronDownIcon width={'16px'} height={'16px'} />
          </button>
        </Tippy>
      </div>

      {/* **THAY ĐỔI QUAN TRỌNG**: Thêm style để đảm bảo content hiển thị đúng */}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export default TableCellReact;
