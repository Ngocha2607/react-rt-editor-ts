import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import TableCellReact from './TableCellReact';

export interface TableCellOptions {
  HTMLAttributes: Record<string, any>;
}

export const CustomTableCell = Node.create<TableCellOptions>({
  name: 'tableCell',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: 'block+',

  addAttributes() {
    return {
      colspan: {
        default: 1,
        parseHTML: (element) => {
          const colspan = element.getAttribute('colspan');
          return colspan ? parseInt(colspan, 10) : 1;
        },
        renderHTML: (attributes) => {
          return attributes.colspan !== 1
            ? { colspan: attributes.colspan }
            : {};
        },
      },
      rowspan: {
        default: 1,
        parseHTML: (element) => {
          const rowspan = element.getAttribute('rowspan');
          return rowspan ? parseInt(rowspan, 10) : 1;
        },
        renderHTML: (attributes) => {
          return attributes.rowspan !== 1
            ? { rowspan: attributes.rowspan }
            : {};
        },
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth
            ? colwidth.split(',').map((width) => parseInt(width, 10))
            : null;
          return value;
        },
        renderHTML: (attributes) => {
          return attributes.colwidth
            ? { colwidth: attributes.colwidth.join(',') }
            : {};
        },
      },
    };
  },

  tableRole: 'cell',

  isolating: true,

  parseHTML() {
    return [{ tag: 'td' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'td',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableCellReact, {
      // **THAY ĐỔI QUAN TRỌNG**: Bỏ contentDOMElementTag vì có thể gây xung đột
      // Để TipTap tự động xử lý DOM structure
      as: 'td', // Đảm bảo render ra thẻ td đúng cách
    });
  },
});
