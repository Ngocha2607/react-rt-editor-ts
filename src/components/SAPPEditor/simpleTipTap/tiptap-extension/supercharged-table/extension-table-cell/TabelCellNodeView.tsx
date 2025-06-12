import React, { FC, useEffect, useRef, useState } from 'react';
import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import Tippy from '@tippyjs/react';

import { ChevronDownIcon } from '@components/SAPPEditor/simpleTipTap/tiptap-icons/chevron-down-icon';
import { CellSelection } from '@_ueberdosis/prosemirror-tables';

interface CellButton {
  name: string;
  action: (editor: Editor) => boolean;
  iconClass?: string;
}

const cellButtonsConfig: CellButton[] = [
  {
    name: 'Add row above',
    action: (editor) => editor.chain().focus().addRowBefore().run(),
    iconClass: 'i-mdi-table-row-plus-before',
  },
  {
    name: 'Add row below',
    action: (editor) => editor.chain().focus().addRowAfter().run(),
    iconClass: 'i-mdi-table-row-plus-after',
  },
  {
    name: 'Add column before',
    action: (editor) => editor.chain().focus().addColumnBefore().run(),
    iconClass: 'i-mdi-table-column-plus-before',
  },
  {
    name: 'Add column after',
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
    iconClass: 'i-mdi-table-column-plus-after',
  },
  {
    name: 'Remove row',
    action: (editor) => editor.chain().focus().deleteRow().run(),
    iconClass: 'i-mdi-table-row-remove',
  },
  {
    name: 'Remove col',
    action: (editor) => editor.chain().focus().deleteColumn().run(),
    iconClass: 'i-mdi-table-column-remove',
  },
  {
    name: 'Toggle header row',
    action: (editor) => editor.chain().focus().toggleHeaderRow().run(),
    iconClass: 'i-mdi-table-row',
  },
  {
    name: 'Toggle header column',
    action: (editor) => editor.chain().focus().toggleHeaderColumn().run(),
    iconClass: 'i-mdi-table-column',
  },
  {
    name: 'Toggle header cell',
    action: (editor) => editor.chain().focus().toggleHeaderCell().run(),
    iconClass: 'i-mdi-table-border',
  },
  {
    name: 'Remove table',
    action: (editor) => editor.chain().focus().deleteTable().run(),
    iconClass: 'i-mdi-table-remove',
  },
];

export const TableCellNodeView: FC<NodeViewProps> = ({
  // node,
  getPos,
  selected,
  editor,
}) => {
  const [isCurrentCellActive, setIsCurrentCellActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const tableCellOptionsButtonRef = useRef<HTMLLabelElement>(null);

  // const calculateActiveSateOfCurrentCell = () => {
  //   try {
  //     // Kiểm tra xem editor.state.selection có tồn tại không
  //     if (!editor?.state?.selection) {
  //       return;
  //     }

  //     const { from, to } = editor.state.selection;

  //     // Kiểm tra xem getPos có phải là hàm không
  //     if (typeof getPos !== 'function') {
  //       return;
  //     }

  //     const nodeFrom = getPos();
  //     const nodeTo = nodeFrom + node.nodeSize;

  //     // Kiểm tra xem selection có nằm trong cell không
  //     // Thêm kiểm tra để xử lý trường hợp selection chạm vào viền cell
  //     if (nodeFrom <= from && to <= nodeTo) {
  //       setIsCurrentCellActive(true);
  //     } else {
  //       // Trường hợp selection vượt ra ngoài cell
  //       setIsCurrentCellActive(false);
  //     }

  //     // Ngăn chặn lỗi localsInner khi selection chạm vào viền cell
  //     const selection = window.getSelection();
  //     if (selection && selection.rangeCount > 0) {
  //       const range = selection.getRangeAt(0);
  //       const cellElement = document.querySelector(`[data-node-id="${node.attrs.id}"]`);

  //       // Nếu selection vượt ra ngoài phạm vi của cell, cần xử lý đặc biệt
  //       if (cellElement && !cellElement.contains(range.commonAncestorContainer)) {
  //         // Đây là trường hợp gây ra lỗi localsInner
  //         // Không làm gì với selection này
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error calculating active state of cell:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (!editor) return;

  //   editor.on("selectionUpdate", calculateActiveSateOfCurrentCell);

  //   // Sử dụng setTimeout an toàn
  //   const timer = setTimeout(calculateActiveSateOfCurrentCell, 100);

  //   return () => {
  //     clearTimeout(timer);
  //     editor.off("selectionUpdate", calculateActiveSateOfCurrentCell);
  //   };
  // }, [editor]); // Thêm editor vào dependency array

  const gimmeDropdownStyles = (): React.CSSProperties => {
    try {
      let top = tableCellOptionsButtonRef.current?.clientTop || 0;
      top += 5;

      let left = tableCellOptionsButtonRef.current?.clientLeft || 0;
      left += 5;

      return {
        top: `${top}px`,
        left: `${left}px`,
      };
    } catch (error) {
      console.error('Error calculating dropdown styles:', error);
      return { top: '0px', left: '0px' };
    }
  };

  // const calculateActiveSateOfCurrentCell = () => {
  //   const { from, to } = editor.state.selection;

  //   const nodeFrom = getPos();
  //   const nodeTo = nodeFrom + node.nodeSize;

  //   setIsCurrentCellActive(nodeFrom <= from && to <= nodeTo);
  // };

  // useEffect(() => {
  //   editor.on("selectionUpdate", calculateActiveSateOfCurrentCell);

  //   setTimeout(calculateActiveSateOfCurrentCell, 100);

  //   return () => {
  //     editor.off("selectionUpdate", calculateActiveSateOfCurrentCell);
  //   };
  // });

  // const gimmeDropdownStyles = (): React.CSSProperties => {
  //   let top = tableCellOptionsButtonRef.current?.clientTop;
  //   if (top) top += 5;

  //   let left = tableCellOptionsButtonRef.current?.clientLeft;
  //   if (left) left += 5;

  //   return {
  //     top: `${top}px`,
  //     left: `${left}px`,
  //   };
  // };
  return (
    <NodeViewWrapper>
      <NodeViewContent as="span" />

      {(isCurrentCellActive || selected) && (
        <Tippy
          visible={showDropdown}
          onClickOutside={() => setShowDropdown(false)}
          appendTo={document.body}
          trigger="click"
          interactive
          animation="shift-toward-subtle"
          placement="right-start"
          content={
            <article className="dropdown" contentEditable={false}>
              <div
                tabIndex={0}
                className="dropdown-content menu"
                style={gimmeDropdownStyles()}
              >
                {cellButtonsConfig.map((btn) => {
                  return (
                    <div key={btn.name}>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          btn.action(editor);
                          setShowDropdown(false);
                        }}
                      >
                        {/* <span>
                          <i className={btn.iconClass} />
                        </span> */}

                        <span>{btn.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          }
        >
          <label
            tabIndex={0}
            className="trigger-button"
            onClick={() => setShowDropdown((prev) => !prev)}
            contentEditable={false}
          >
            <ChevronDownIcon width="16px" height="16px" />
          </label>
        </Tippy>
      )}
    </NodeViewWrapper>
  );
};
