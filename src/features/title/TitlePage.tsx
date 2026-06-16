import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppData } from '../../hooks/useAppData.ts'
import { usePlayerContext } from '../../app/PlayerContext.tsx'
import type { PlayerEntry } from '../../types/index.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'

const AVATAR_OPTIONS = ['😀', '😎', '🌟', '🎮', '🦊', '🐱', '🐶', '🦁', '🐼', '🚀', '⭐', '🎯']

const COPYRIGHT = '© 2026 藤井信太郎  |  Test Release 2026.6.16'

function CopyrightLine() {
  return (
    <p className="font-pixel text-pixel-cream/25" style={{ fontSize: '0.55rem', letterSpacing: '0.04em' }}>
      {COPYRIGHT}
    </p>
  )
}

// ── Player selection screen ───────────────────────────────────────────────────

function PlayerSelectScreen({
  players, onSelect, onAdd,
}: { players: PlayerEntry[]; onSelect: (p: PlayerEntry) => void; onAdd: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-pixel-night p-6">
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="font-pixel text-base tracking-widest text-pixel-red">☣ ZOMBIE TYPING ☣</p>
        <h1 className="font-pixel text-4xl leading-tight text-pixel-gold">DETERMINATION</h1>
      </motion.div>

      <motion.div className="w-full max-w-lg space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <p className="text-center font-pixel text-lg text-pixel-cream">だれがあそぶ？</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {players.map((p) => (
            <motion.button key={p.name} onClick={() => onSelect(p)}
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 rounded border-4 border-pixel-cream/30 bg-pixel-panel p-4 font-pixel text-pixel-cream transition-colors hover:border-pixel-gold hover:text-pixel-gold"
            >
              <span className="text-4xl">{p.avatar}</span>
              <span className="text-sm">{p.name}</span>
            </motion.button>
          ))}
          <motion.button onClick={onAdd}
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 rounded border-4 border-dashed border-pixel-cream/20 bg-pixel-night p-4 font-pixel text-pixel-cream/50 transition-colors hover:border-pixel-green hover:text-pixel-green"
          >
            <span className="text-4xl">＋</span>
            <span className="text-sm">あたらしいひと</span>
          </motion.button>
        </div>
      </motion.div>
      <CopyrightLine />
    </div>
  )
}

// ── Add player dialog ─────────────────────────────────────────────────────────

function AddPlayerDialog({
  existingNames, onClose, onConfirm,
}: { existingNames: string[]; onClose: () => void; onConfirm: (name: string, avatar: string) => void }) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('😀')
  const trimmed = name.trim()
  const isDuplicate = existingNames.includes(trimmed)
  const canSubmit = trimmed.length > 0 && !isDuplicate

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm space-y-5 border-4 border-pixel-gold bg-pixel-panel p-6"
        style={{ boxShadow: '8px 8px 0 #05050a' }}
      >
        <p className="text-center font-pixel text-pixel-gold">あたらしいひとをついかする</p>

        <div className="space-y-1">
          <p className="font-pixel text-xs text-pixel-cream/60">なまえ</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={10}
            placeholder="なまえをいれてね"
            className="w-full rounded border-2 border-pixel-cream/30 bg-pixel-night px-3 py-2 font-pixel text-pixel-cream focus:border-pixel-gold focus:outline-none"
          />
          {isDuplicate && <p className="font-pixel text-xs text-pixel-red">そのなまえはすでにつかわれています</p>}
        </div>

        <div className="space-y-2">
          <p className="font-pixel text-xs text-pixel-cream/60">マーク</p>
          <div className="grid grid-cols-6 gap-1">
            {AVATAR_OPTIONS.map((a) => (
              <button key={a} onClick={() => setAvatar(a)}
                className={`rounded p-1.5 text-2xl transition-all ${avatar === a ? 'scale-110 border-2 border-pixel-gold bg-pixel-night' : 'border-2 border-transparent hover:border-pixel-cream/40'}`}
              >{a}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded bg-pixel-night px-4 py-3">
          <span className="text-3xl">{avatar}</span>
          <span className="font-pixel text-pixel-cream">{trimmed || '…'}</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-pixel-cream/30 py-2 font-pixel text-xs text-pixel-cream/60 hover:border-pixel-cream hover:text-pixel-cream">やめる</button>
          <button disabled={!canSubmit} onClick={() => { if (canSubmit) onConfirm(trimmed, avatar) }}
            className={`flex-1 py-2 font-pixel text-xs ${canSubmit ? 'cursor-pointer bg-pixel-gold text-pixel-night hover:opacity-90' : 'cursor-not-allowed border-2 border-pixel-cream/20 text-pixel-cream/30'}`}
          >けってい！</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Normal title (player selected) ────────────────────────────────────────────

function NormalTitle({ player, onClear }: { player: PlayerEntry; onClear: () => void }) {
  const { snapshot, save } = useAppData()
  const unreadMessages = snapshot.parentMessages.filter((m) => m.readAt === null)
  const [dialogOpen, setDialogOpen] = useState(() => unreadMessages.length > 0)

  function handleCloseDialog() {
    const now = new Date().toISOString()
    save({ ...snapshot, parentMessages: snapshot.parentMessages.map((m) => m.readAt === null ? { ...m, readAt: now } : m) })
    setDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-pixel-night p-6">
      <motion.div className="text-center" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <p className="font-pixel text-base tracking-widest text-pixel-red">☣ ZOMBIE TYPING ☣</p>
        <h1 className="font-pixel text-5xl leading-tight text-pixel-gold md:text-7xl">DETERMINATION</h1>
      </motion.div>

      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
        <p className="text-3xl">{player.avatar}</p>
        <p className="mt-1 font-pixel text-pixel-cream/80">こんにちは、{player.name}！</p>
      </motion.div>

      <motion.p className="max-w-sm text-center text-pixel-cream/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        タイピングでゾンビをたおせ！
      </motion.p>

      <motion.div className="flex flex-col gap-4 sm:flex-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
        <Link to="/game/map">
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <PixelButton className="min-w-44 text-base">▶ こどもモード</PixelButton>
          </motion.div>
        </Link>
        <Link to="/parent/dashboard">
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <PixelButton className="min-w-44 text-base">▶ おとうさんモード</PixelButton>
          </motion.div>
        </Link>
      </motion.div>

      <motion.button onClick={onClear} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="font-pixel text-xs text-pixel-cream/40 transition-colors hover:text-pixel-cream/70"
      >
        ← ほかのひとにかえる
      </motion.button>

      <CopyrightLine />

      {dialogOpen && unreadMessages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}>
            <PixelPanel className="max-w-md space-y-4">
              <h2 className="font-pixel text-xl text-pixel-gold">✉ おとうさんからのメッセージ</h2>
              <div className="space-y-3">
                {unreadMessages.map((msg) => (
                  <p key={msg.id} className="rounded bg-pixel-night p-3 text-sm leading-relaxed">{msg.body}</p>
                ))}
              </div>
              <PixelButton onClick={handleCloseDialog} className="w-full">とじる</PixelButton>
            </PixelPanel>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── Main TitlePage ────────────────────────────────────────────────────────────

export function TitlePage() {
  const { currentPlayer, players, selectPlayer, addPlayer, clearSelection } = usePlayerContext()
  const [showAddDialog, setShowAddDialog] = useState(false)

  function handleAddConfirm(name: string, avatar: string) {
    const player = addPlayer(name, avatar)
    selectPlayer(player)
    setShowAddDialog(false)
  }

  if (!currentPlayer) {
    return (
      <>
        <PlayerSelectScreen players={players} onSelect={selectPlayer} onAdd={() => setShowAddDialog(true)} />
        <AnimatePresence>
          {showAddDialog && (
            <AddPlayerDialog
              existingNames={players.map((p) => p.name)}
              onClose={() => setShowAddDialog(false)}
              onConfirm={handleAddConfirm}
            />
          )}
        </AnimatePresence>
      </>
    )
  }

  return <NormalTitle player={currentPlayer} onClear={clearSelection} />
}
