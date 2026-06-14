import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppData } from '../../hooks/useAppData.ts'
import { PixelButton, PixelPanel } from '../../design/index.ts'

export function TitlePage() {
  const { snapshot, save } = useAppData()
  const unreadMessages = snapshot.parentMessages.filter((m) => m.readAt === null)
  const [dialogOpen, setDialogOpen] = useState(() => unreadMessages.length > 0)

  function handleCloseDialog() {
    const now = new Date().toISOString()
    save({
      ...snapshot,
      parentMessages: snapshot.parentMessages.map((m) =>
        m.readAt === null ? { ...m, readAt: now } : m,
      ),
    })
    setDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-pixel-night p-6">
      {/* Logo */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-pixel text-base tracking-widest text-pixel-red">☣ ZOMBIE TYPING ☣</p>
        <h1 className="font-pixel text-5xl leading-tight text-pixel-gold md:text-7xl">
          DETERMINATION
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="max-w-sm text-center text-pixel-cream/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        タイピングでゾンビをたおせ！
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
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

      {/* Unread parent message dialog */}
      {dialogOpen && unreadMessages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <PixelPanel className="max-w-md space-y-4">
              <h2 className="font-pixel text-xl text-pixel-gold">
                ✉ おとうさんからのメッセージ
              </h2>
              <div className="space-y-3">
                {unreadMessages.map((msg) => (
                  <p
                    key={msg.id}
                    className="rounded bg-pixel-night p-3 text-sm leading-relaxed"
                  >
                    {msg.body}
                  </p>
                ))}
              </div>
              <PixelButton onClick={handleCloseDialog} className="w-full">
                とじる
              </PixelButton>
            </PixelPanel>
          </motion.div>
        </div>
      )}
    </div>
  )
}
