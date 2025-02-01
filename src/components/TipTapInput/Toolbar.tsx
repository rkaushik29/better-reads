import { Button } from '@/components/ui/button'
import { Editor } from '@tiptap/react'
import { JSX, memo, useCallback } from 'react'
import { Bold, Italic, Underline, Strikethrough, List, ListCollapse } from 'lucide-react'

interface ToolbarProps {
  trailingActions?: JSX.Element
  disabled?: boolean
  editor: Editor
}

export const Toolbar = memo(
  ({ trailingActions, disabled, editor }: ToolbarProps) => {
    const toggleHeaderCell = useCallback(() => {
      editor?.chain().focus().toggleHeaderCell().run()
    }, [editor])

    const toggleBold = useCallback(() => {
      editor?.chain().focus().toggleBold().run()
    }, [editor])

    const toggleItalic = useCallback(() => {
      editor?.chain().focus().toggleItalic().run()
    }, [editor])

    const toggleUnderline = useCallback(() => {
      editor?.chain().focus().toggleUnderline().run()
    }, [editor])

    const toggleStrike = useCallback(() => {
      editor?.chain().focus().toggleStrike().run()
    }, [editor])

    const toggleOrderedList = useCallback(() => {
      editor?.chain().focus().toggleOrderedList().run()
    }, [editor])

    const toggleBulletList = useCallback(() => {
      editor?.chain().focus().toggleBulletList().run()
    }, [editor])

    const hasSelectedCell = editor?.isActive('tableCell') || editor?.isActive('tableHeader')

    return (
      <div className='flex w-full items-center justify-between gap-1 self-end'>
        <div className='flex gap-3'>
          <Button
            disabled={disabled}
            size='sm'
            icon={<Bold size={16} />}
            type='button'
            variant='outline'
            onClick={toggleBold}
            color='text-subtle'
          />
          <Button
            disabled={disabled}
            size='sm'
            icon={<Italic size={16} />}
            type='button'
            variant='outline'
            onClick={toggleItalic}
            color='text-subtle'
          />
          <Button
            disabled={disabled}
            size='sm'
            icon={<Underline size={16} />}
            type='button'
            variant='outline'
            onClick={toggleUnderline}
            color='text-subtle'
          />
          <Button
            disabled={disabled}
            size='sm'
            icon={<Strikethrough size={16} />}
            type='button'
            variant='outline'
            onClick={toggleStrike}
            color='text-subtle'
          />
          <Button
            disabled={disabled}
            size='sm'
            icon={<ListCollapse size={16} />}
            type='button'
            variant='outline'
            onClick={toggleOrderedList}
            color='text-subtle'
          />
          <Button
            disabled={disabled}
            size='sm'
            icon={<List size={16} />}
            type='button'
            variant='outline'
            onClick={toggleBulletList}
            color='text-subtle'
          />
        </div>
        {hasSelectedCell && (
          <Button
            disabled={disabled}
            size='sm'
            variant='ghost'
            onClick={toggleHeaderCell}
            color='text-subtle'
            type='button'
          >
            Make header
          </Button>
        )}
        {trailingActions}
      </div>
    )
  },
  (prevProps, nextProps) => {
    const prevEditorState = {
      isBold: prevProps.editor?.isActive('bold'),
      isItalic: prevProps.editor?.isActive('italic'),
      isUnderline: prevProps.editor?.isActive('underline'),
      isStrike: prevProps.editor?.isActive('strike'),
      isOrderedList: prevProps.editor?.isActive('orderedList'),
      isBulletList: prevProps.editor?.isActive('bulletList'),
      hasSelectedCell: prevProps.editor?.isActive('tableCell') || prevProps.editor?.isActive('tableHeader'),
    }

    const nextEditorState = {
      isBold: nextProps.editor?.isActive('bold'),
      isItalic: nextProps.editor?.isActive('italic'),
      isUnderline: nextProps.editor?.isActive('underline'),
      isStrike: nextProps.editor?.isActive('strike'),
      isOrderedList: nextProps.editor?.isActive('orderedList'),
      isBulletList: nextProps.editor?.isActive('bulletList'),
      hasSelectedCell: nextProps.editor?.isActive('tableCell') || nextProps.editor?.isActive('tableHeader'),
    }

    return (
      prevProps.disabled === nextProps.disabled &&
      prevProps.trailingActions === nextProps.trailingActions &&
      JSON.stringify(prevEditorState) === JSON.stringify(nextEditorState)
    )
  },
)
