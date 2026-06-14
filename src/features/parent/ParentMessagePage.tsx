import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ParentMessage } from '../../types/index.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'
import { formatDateTime } from './parentUtils.ts'
import { useParentData } from './useParentData.ts'

const MAX_BODY_LENGTH = 200

function ReadBadge({ readAt }: { readAt: string | null }) {
  if (readAt !== null) {
    return (
      <span className="rounded bg-pixel-green/20 px-2 py-0.5 text-xs text-pixel-green">
        既読
      </span>
    )
  }
  return (
    <span className="rounded bg-pixel-gold/20 px-2 py-0.5 text-xs text-pixel-gold">未読</span>
  )
}

interface MessageRowProps {
  message: ParentMessage
  onDelete: (id: string) => void
}

function MessageRow({ message, onDelete }: MessageRowProps) {
  return (
    <li className="flex items-start gap-3 rounded bg-pixel-night p-3">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <ReadBadge readAt={message.readAt} />
          <span className="text-xs text-pixel-cream/50">送信: {formatDateTime(message.createdAt)}</span>
          {message.readAt && (
            <span className="text-xs text-pixel-cream/30">既読: {formatDateTime(message.readAt)}</span>
          )}
        </div>
        <p className="whitespace-pre-wrap break-words text-sm text-pixel-cream">{message.body}</p>
      </div>
      {message.readAt !== null && (
        <button
          type="button"
          onClick={() => onDelete(message.id)}
          className="shrink-0 rounded border border-pixel-red/50 px-3 py-1 text-xs text-pixel-red transition hover:bg-pixel-red/20"
        >
          削除
        </button>
      )}
    </li>
  )
}

export function ParentMessagePage() {
  const { snapshot, save } = useParentData()
  const [body, setBody] = useState('')

  const messages = [...snapshot.parentMessages].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  function handleSend() {
    const trimmed = body.trim()
    if (trimmed.length === 0) return

    const newMessage: ParentMessage = {
      id: crypto.randomUUID(),
      body: trimmed,
      createdAt: new Date().toISOString(),
      readAt: null,
    }
    save({ ...snapshot, parentMessages: [...snapshot.parentMessages, newMessage] })
    setBody('')
  }

  function handleDelete(id: string) {
    save({
      ...snapshot,
      parentMessages: snapshot.parentMessages.filter(m => m.id !== id),
    })
  }

  const canSend = body.trim().length > 0

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pixel-gold">メッセージ</h1>
        <Link to="/parent/dashboard">
          <PixelButton>← 戻る</PixelButton>
        </Link>
      </div>

      {/* Compose */}
      <PixelPanel className="space-y-3">
        <h2 className="text-base font-bold text-pixel-cream">メッセージを送る</h2>
        <p className="text-xs text-pixel-cream/60">
          次にこどもがゲームを開いたときに表示されます。
        </p>
        <textarea
          className="w-full rounded border-2 border-pixel-cream/20 bg-pixel-night p-3 text-sm text-pixel-cream placeholder-pixel-cream/30 focus:border-pixel-gold focus:outline-none"
          rows={4}
          maxLength={MAX_BODY_LENGTH}
          placeholder="こどもへのメッセージを入力..."
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-pixel-cream/40">
            {body.length} / {MAX_BODY_LENGTH}
          </span>
          <PixelButton onClick={handleSend} disabled={!canSend}>
            送信
          </PixelButton>
        </div>
      </PixelPanel>

      {/* Message list */}
      <PixelPanel>
        <h2 className="mb-3 text-base font-bold text-pixel-cream">送信済みメッセージ</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-pixel-cream/40">まだメッセージはありません。</p>
        ) : (
          <ul className="space-y-3">
            {messages.map(msg => (
              <MessageRow key={msg.id} message={msg} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </PixelPanel>
    </div>
  )
}
