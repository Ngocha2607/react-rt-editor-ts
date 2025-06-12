import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Spacer } from './tiptap-ui-primitive/spacer';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarRow,
  ToolbarSeparator,
} from './tiptap-ui-primitive/toolbar';
import { Select } from 'antd';
import { UndoRedoButton } from './simpleTipTap/tiptap-ui/undo-redo-button';
import { HeadingDropdownMenu } from './simpleTipTap/tiptap-ui/heading-dropdown-menu';
import { ListDropdownMenu } from './simpleTipTap/tiptap-ui/list-dropdown-menu';
import { NodeButton } from './simpleTipTap/tiptap-ui/node-button';
import { MarkButton } from './simpleTipTap/tiptap-ui/mark-button';
import { TableIcon } from './simpleTipTap/tiptap-icons/table-icon';
import {
  HighlightContent,
  HighlighterButton,
  HighlightPopover,
} from './simpleTipTap/tiptap-ui/highlight-popover';
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from './simpleTipTap/tiptap-ui/link-popover';
import { TextAlignButton } from './simpleTipTap/tiptap-ui/text-align-button';
import { ImageUploadButton } from './simpleTipTap/tiptap-ui/image-upload-button';
import { Button } from './tiptap-ui-primitive/button';
import { ArrowLeftIcon } from './simpleTipTap/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from './simpleTipTap/tiptap-icons/highlighter-icon';
import { LinkIcon } from './simpleTipTap/tiptap-icons/link-icon';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { ImageUploadNode } from './simpleTipTap/tiptap-node/image-upload-node';
import { MAX_FILE_SIZE } from '@utils/tiptap-utils';
import TrailingNode from './simpleTipTap/tiptap-extension/trailing-node-extension';
import Link from './simpleTipTap/tiptap-extension/link-extension';
import { useMobile } from 'src/hooks/use-mobile';
import { useWindowSize } from 'src/hooks/use-window-size';
import ColorPicker from './simpleTipTap/tiptap-ui/color-dropdown/ColorPicker';
import Selection from './simpleTipTap/tiptap-extension/selection-extension';
import { ThemeToggle } from './theme-toggle';
import { FontSize } from './FontSize';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { MoreButton } from './simpleTipTap/tiptap-ui/more-button';
import clsx from 'clsx';
import FontSizeDropdown from './simpleTipTap/tiptap-ui/fontsize-dropdown/fontsize-dropdown';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { CustomTableCell } from './simpleTipTap/tiptap-extension/table/custom-table-cell';
import { ResizableImage } from './simpleTipTap/tiptap-extension/image/CustomImage';

const fontOptions = [
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Andale Mono', value: '"Andale Mono"' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Arial Black', value: '"Arial Black"' },
  { label: 'Book Antiqua', value: '"Book Antiqua"' },
  { label: 'Comic Sans MS', value: '"Comic Sans MS", "Comic Sans"' },
  { label: 'Courier New', value: '"Courier New", Courier' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Impact', value: 'Impact' },
  { label: 'Symbol', value: 'Symbol' },
  { label: 'Tahoma', value: 'Tahoma' },
  { label: 'Terminal', value: 'Terminal' },
  { label: 'Times New Roman', value: '"Times New Roman", Times' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS"' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Webdings', value: 'Webdings' },
  { label: 'Wingdings', value: 'Wingdings' },
];

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  editor,
  isShowIconImageUpload,
  disabled,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  editor: Editor | null;
  isShowIconImageUpload: boolean;
  disabled: boolean;
}) => {
  const [showMore, setShowMore] = useState(false);

  // Xác định font đang active
  const activeFont =
    fontOptions.find((option) =>
      editor?.isActive('textStyle', { fontFamily: option.value }),
    )?.value || 'Roboto';

  const handleChangeFontFamily = (value: string) => {
    if (value === 'unset') {
      editor?.chain().focus().unsetFontFamily().run();
    } else {
      editor?.chain().focus().setFontFamily(value).run();
    }
  };
  if (disabled)
    return (
      <React.Fragment>
        {' '}
        <Spacer />
        <ToolbarGroup>
          {' '}
          <ThemeToggle />{' '}
        </ToolbarGroup>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <ToolbarRow>
        <ToolbarGroup>
          <Select
            style={{ width: 120 }}
            placeholder="Chọn font"
            value={activeFont || undefined}
            onChange={handleChangeFontFamily}
            options={[...fontOptions, { label: 'Unset', value: 'unset' }]}
            dropdownStyle={{ width: 200 }}
          />
          <Spacer />
          <FontSizeDropdown editor={editor} />
        </ToolbarGroup>

        <ToolbarGroup>
          <HeadingDropdownMenu levels={[1, 2, 3, 4, 5]} />
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="underline" />
          <MarkButton type="strike" />
        </ToolbarGroup>
        <ToolbarGroup>
          {editor && <ColorPicker editor={editor} />}
          {!isMobile ? (
            <HighlightPopover />
          ) : (
            <HighlighterButton onClick={onHighlighterClick} />
          )}
        </ToolbarGroup>
        <ToolbarGroup>
          <button
            onClick={() =>
              editor?.commands.insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
            }
            className="tiptap-button tiptap-button-ghost bg-transparent"
          >
            <TableIcon className="tiptap-button-icon" />
          </button>
        </ToolbarGroup>
        <ToolbarGroup>
          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />
          <TextAlignButton align="justify" />
        </ToolbarGroup>
        <ToolbarGroup>
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
        </ToolbarGroup>

        {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}

        <Spacer />
        <MoreButton onClick={() => setShowMore(!showMore)} />
      </ToolbarRow>

      {showMore && (
        <ToolbarRow
          className={clsx({ expanded: showMore, collapsed: !showMore })}
        >
          <ToolbarGroup>
            <ListDropdownMenu
              types={['bulletList', 'orderedList', 'taskList']}
            />
            {/* <MarkButton type="code" /> */}
            <NodeButton type="codeBlock" />
            <NodeButton type="blockquote" />

            {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <MarkButton type="superscript" />
            <MarkButton type="subscript" />
          </ToolbarGroup>
          <ToolbarSeparator />
          {isShowIconImageUpload && (
            <ToolbarGroup>
              <ImageUploadButton />
            </ToolbarGroup>
          )}
          <Spacer />
          {isMobile && <ToolbarSeparator />}
        </ToolbarRow>
      )}
    </React.Fragment>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link';
  onBack: () => void;
}) => (
  <div>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? <HighlightContent /> : <LinkContent />}
  </div>
);
type UseEditorControllerProps = {
  content?: string;
  onChange?: (html: string) => void;
  handleImageUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
  placeholder?: string;
};

const SAPPEditor = ({
  content = '',
  onChange,
  handleImageUpload,
  disabled = false,
  placeholder = '',
}: UseEditorControllerProps) => {
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    'main' | 'highlighter' | 'link'
  >('main');
  const [rect, setRect] = React.useState<
    Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>
  >({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const editor = useEditor({
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      handleDOMEvents: {
        focus: () => true,
      },
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
      },
      handlePaste(view, event, slice) {
        const items = Array.from(event.clipboardData?.items || []);

        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file && handleImageUpload) {
              // 👉 Xử lý upload ảnh tại đây
              handleImageUpload(file).then((url) => {
                editor?.chain().focus().setImage({ src: url }).run();
              });
            }
            return true; // Ngăn dán mặc định
          }
        }

        return false; // Cho phép các nội dung khác dán bình thường
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        defaultSize: '14px',
      }),
      Document,
      Text,
      Paragraph,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Selection,
      Typography,
      Superscript,
      Subscript,
      Color.configure({
        types: ['textStyle'],
      }),
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => {
          // Handle error without console.log
          return error;
        },
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="sapp-editor-container">
        <Toolbar
          ref={toolbarRef}
          style={
            isMobile
              ? {
                  bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
                }
              : {}
          }
        >
          {mobileView === 'main' ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView('highlighter')}
              onLinkClick={() => setMobileView('link')}
              isMobile={isMobile}
              editor={editor}
              isShowIconImageUpload={!!handleImageUpload}
              disabled={disabled}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
              onBack={() => setMobileView('main')}
            />
          )}
        </Toolbar>
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
          onMouseDown={(e) => {
            // Cho phép select
            e.stopPropagation();
          }}
          onChange={(e) => {
            console.log(e);
          }}
        />
      </div>
    </EditorContext.Provider>
  );
};

export default SAPPEditor;
