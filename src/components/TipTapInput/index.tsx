import React, { FC, JSX, useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { twMerge } from 'tailwind-merge';

import { Toolbar } from './Toolbar';
import {
  RichTextInputVariants,
  TableVariants,
  TableRowVariants,
  TableCellVariants,
  TableHeaderVariants,
} from './variants';

export type TipTapInputBaseProps = {
  variant?: 'default' | 'inline';
  label?: string;
  required?: boolean;
  leadingLabel?: string;
  trailingLabel?: string;
  onClear?: () => void;
  value?: string | null;
  trailingActions?: JSX.Element;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxCharCount?: number;
  errorMessage?: string;
  maxHeight?: boolean;
  resizable?: boolean;
} & (
  | {
      readOnly?: false;
      onChange?: (value: string) => void;
      onBlur?: (value: string) => void;
    }
  | {
      readOnly: true;
      onChange?: never;
      onBlur?: never;
    }
);

type TipTapInputWithCount = {
  showCount: true;
  trailingLabel?: never;
};

type TipTapInputWithoutCount = {
  showCount?: false;
  trailingLabel?: string;
};

export type TipTapInputProps = TipTapInputBaseProps & (TipTapInputWithCount | TipTapInputWithoutCount);

const baseExtensions = [
  StarterKit.configure(),
  Underline.configure(),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    linkOnPaste: true,
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: twMerge(TableVariants()),
    },
  }),
  TableRow.configure({
    HTMLAttributes: { class: twMerge(TableRowVariants()) },
  }),
  TableCell.configure({
    HTMLAttributes: { class: twMerge(TableCellVariants()) },
  }),
  TableHeader.configure({
    HTMLAttributes: { class: twMerge(TableHeaderVariants()) },
  }),
];

export const TipTapInput: FC<TipTapInputProps> = ({
  variant = 'default',
  label,
  value,
  onChange,
  onBlur,
  required = false,
  leadingLabel,
  trailingLabel,
  trailingActions,
  disabled = false,
  readOnly,
  showCount = false,
  maxCharCount = 1000,
  errorMessage,
  maxHeight,
  resizable,
}) => {
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: baseExtensions,
    content: value || '',
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      if (htmlContent === '<p></p>') {
        setCharCount(0);
        onChange?.('');
        return;
      }
      setCharCount(htmlContent.length);
      onChange?.(htmlContent);
    },
    editable: !disabled && !readOnly,
    onBlur: ({ editor }) => {
      const htmlContent = editor.getHTML();
      if (htmlContent === '<p></p>') {
        onBlur?.('');
        return;
      }
      onBlur?.(htmlContent);
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none mx-auto focus:outline-none w-full h-full flex-shrink flex-grow-0 overflow-y-auto max-h-40 min-h-24 text-zinc-500',
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="relative flex flex-col gap-1.5">
      {label && (
        <div className="flex items-end justify-between">
          <div className="flex flex-col items-start">
            <label
              className="font-brand text-base font-medium text-secondary"
              htmlFor={label}
              id={`${label}-label`}
            >
              {label}
              {required && <span className="ml-1 font-brand text-base font-medium text-alert-primary">*</span>}
            </label>
            {leadingLabel && (
              <span className="line-clamp-2 font-brand text-sm font-regular text-subtle">{leadingLabel}</span>
            )}
          </div>
          {showCount ? (
            <span
              className={`text-right font-brand text-xs font-regular ${
                charCount > maxCharCount ? 'text-alert-primary' : 'text-subtle'
              }`}
            >
              {charCount} / {maxCharCount} characters
            </span>
          ) : (
            trailingLabel && <span className="font-brand text-xs font-regular text-subtle">{trailingLabel}</span>
          )}
        </div>
      )}

      <div className={twMerge(RichTextInputVariants({ variant, errorMessage: !!errorMessage, disabled, readOnly, maxHeight, resizable }))}>
        <EditorContent editor={editor} className="editor-content" />
        {!readOnly && (
          <div onMouseDown={(e) => e.preventDefault()} className="bg-low">
            <Toolbar trailingActions={trailingActions} disabled={disabled} editor={editor} />
          </div>
        )}
      </div>
      {errorMessage && (
        <span id={`${label}-error-hint`} className="line-clamp-2 w-full text-end font-brand text-sm font-regular text-alert-primary">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
