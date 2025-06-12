import { stopPrevent } from '@components/SAPPEditor/simpleTipTap/utils';
import { mergeAttributes, Node } from '@tiptap/core';
import { NodeSelection } from 'prosemirror-state';

export interface TableRowOptions {
  HTMLAttributes: Record<string, any>;
}

const isScrollable = function (ele: any) {
  const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

  const overflowYStyle = window.getComputedStyle(ele).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

  return hasScrollableContent && !isOverflowHidden;
};

const getScrollableParent = function (ele: any): any {
  // eslint-disable-next-line no-nested-ternary
  return !ele || ele === document.body
    ? document.body
    : isScrollable(ele)
      ? ele
      : getScrollableParent(ele.parentNode);
};

const getElementWithAttributes = (
  name: string,
  attrs?: Record<string, any>,
  events?: Record<string, any>,
) => {
  const el = document.createElement(name);

  if (!el) throw new Error(`Element with name ${name} can't be created.`);

  if (attrs) {
    Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val));
  }

  if (events) {
    Object.entries(events).forEach(([key, val]) => {
      // Bọc tất cả event handlers để ngăn chặn lỗi localsInner
      const safeHandler = (event: Event) => {
        try {
          // Gọi handler gốc trong try-catch
          (val as EventListener)(event);
        } catch (error) {
          // Bỏ qua lỗi trong event handlers
          console.error('Error in table row event handler:', error);
        }
      };

      el.addEventListener(key, safeHandler);
    });
  }

  return el;
};

export const TableRow = Node.create<TableRowOptions>({
  name: 'tableRow',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: '(tableCell | tableHeader)*',

  tableRole: 'row',

  parseHTML() {
    return [{ tag: 'tr' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'tr',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addNodeView() {
    return ({ editor, HTMLAttributes, getPos }) => {
      const pos = () => {
        try {
          if (typeof getPos !== 'function') return 0;
          return (getPos as () => number)();
        } catch (error) {
          console.error('Error getting position:', error);
          return 0;
        }
      };

      const scrollableParent = getScrollableParent(
        editor.options.element,
      ) as HTMLDivElement;

      let isCursorInsideControlSection = false;

      const actions = {
        deleteRow: () => {
          try {
            this.editor.chain().deleteNode('tableRow').focus().run();
          } catch (error) {
            console.error('Error deleting row:', error);
          }
        },
        selectRow: () => {
          try {
            const from = pos();

            if (from === 0) return; // Không hợp lệ

            const resolvedFrom = editor.state.doc.resolve(from);

            const nodeSel = new NodeSelection(resolvedFrom);

            editor.view.dispatch(editor.state.tr.setSelection(nodeSel));
          } catch (error) {
            console.error('Error selecting row:', error);
          }
        },
      };

      const setCursorInsideControlSection = () => {
        isCursorInsideControlSection = true;
      };

      const setCursorOutsideControlSection = () => {
        isCursorInsideControlSection = false;
      };

      const controlSection = getElementWithAttributes(
        'section',
        {
          class: 'supercharged-table-control-section hidden',
          contenteditable: 'false',
        },
        {
          click: (e: any) => {
            if (e) stopPrevent(e);
            actions.selectRow();
          },
          mouseenter: () => {
            setCursorInsideControlSection();
          },
          mouseover: () => {
            setCursorInsideControlSection();
          },
          mouseleave: () => {
            setCursorOutsideControlSection();
            hideControls();
          },
        },
      );

      const deleteButton = getElementWithAttributes(
        'button',
        {
          class: 'delete-row-table-button',
        },
        {
          click: (e: any) => {
            if (e) stopPrevent(e);
            actions.deleteRow();
          },
        },
      );

      const showControls = () => {
        repositionControlsCenter();
        controlSection.classList.remove('hidden');
      };

      const hideControls = () => {
        setTimeout(() => {
          if (isCursorInsideControlSection) return;
          controlSection.classList.add('hidden');
        }, 100);
      };

      // Thêm event handlers an toàn để ngăn lỗi localsInner
      const safeShowControls = () => {
        try {
          showControls();
        } catch (error) {
          console.error('Error showing controls:', error);
        }
      };

      const safeHideControls = () => {
        try {
          hideControls();
        } catch (error) {
          console.error('Error hiding controls:', error);
        }
      };
      const editorContent = document.querySelector('.simple-editor-content');
      const tableRow = getElementWithAttributes(
        'tr',
        {
          ...HTMLAttributes,
          'data-safe-selection': 'true', // Marker để xác định trong TableCell
        },
        {
          mouseenter: safeShowControls,
          mouseover: safeShowControls,
          mouseleave: safeHideControls,

          // Thêm handler để ngăn chặn lỗi localsInner
          mouseup: (e: MouseEvent) => {
            try {
              const selection = window.getSelection();
              if (selection && selection.toString()) {
                // Nếu có text được chọn, ngăn event bubbling
                e.stopPropagation();
              }
            } catch (error) {
              // Bỏ qua lỗi
            }
          },
        },
      );

      deleteButton.textContent = 'x';

      controlSection.append(deleteButton);

      editorContent?.appendChild(controlSection);

      let rectBefore = '';

      const repositionControlsCenter = () => {
        try {
          setTimeout(() => {
            try {
              if (
                !tableRow ||
                !tableRow.getBoundingClientRect ||
                !editorContent
              )
                return;

              // const rowCoords = tableRow.getBoundingClientRect();
              // const parentCoords = editorContent?.getBoundingClientRect();
              // const stringifiedRowCoords = JSON.stringify(rowCoords);

              // if (rectBefore === stringifiedRowCoords) return;

              // controlSection.style.top = `${
              //   rowCoords.top + document.documentElement.scrollTop
              // }px`;
              // controlSection.style.left = `${
              //   rowCoords.x + document.documentElement.scrollLeft - 8
              // }px`;
              // controlSection.style.height = `${rowCoords.height + 1}px`;

              // rectBefore = stringifiedRowCoords;
              const rowCoords = tableRow.getBoundingClientRect();
              const wrapperCoords = editorContent.getBoundingClientRect();
              const top = rowCoords.top - wrapperCoords.top;
              const left = rowCoords.left - wrapperCoords.left - 8; // lệch trái để controlSection hiện ra bên trái hàng

              controlSection.style.top = `${top}px`;
              controlSection.style.left = `${left}px`;
              controlSection.style.height = `${rowCoords.height}px`;
            } catch (error) {
              console.error(
                'Error in setTimeout of repositionControlsCenter:',
                error,
              );
            }
          });
        } catch (error) {
          console.error('Error in repositionControlsCenter:', error);
        }
      };

      // Bọc các event handlers an toàn
      const safeRepositionControlsCenter = () => {
        try {
          repositionControlsCenter();
        } catch (error) {
          console.error('Error in safeRepositionControlsCenter:', error);
        }
      };

      setTimeout(() => {
        try {
          repositionControlsCenter();
        } catch (error) {
          console.error('Error in initial repositionControlsCenter:', error);
        }
      }, 100);

      // Đăng ký event handlers an toàn
      editor.on('selectionUpdate', safeRepositionControlsCenter);
      editor.on('update', safeRepositionControlsCenter);

      if (scrollableParent) {
        scrollableParent.addEventListener(
          'scroll',
          safeRepositionControlsCenter,
        );
      }

      document.addEventListener('scroll', safeRepositionControlsCenter);

      const destroy = () => {
        try {
          if (controlSection && controlSection.parentNode) {
            controlSection.remove();
          }

          editor.off('selectionUpdate', safeRepositionControlsCenter);
          editor.off('update', safeRepositionControlsCenter);

          if (scrollableParent) {
            scrollableParent.removeEventListener(
              'scroll',
              safeRepositionControlsCenter,
            );
          }

          document.removeEventListener('scroll', safeRepositionControlsCenter);
        } catch (error) {
          console.error('Error in destroy:', error);
        }
      };

      return {
        dom: tableRow,
        contentDOM: tableRow,
        destroy,
      };
    };
  },
});
