import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { romajiCheatSheet } from '../../../content/index.ts'

interface RomajiChartPanelProps {
  /** If provided, overrides the internal open/close state (controlled). */
  defaultOpen?: boolean
}

export function RomajiChartPanel({ defaultOpen = false }: RomajiChartPanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-2 border-pixel-cream/20 bg-pixel-panel">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2 font-pixel text-xs text-pixel-cream/70 hover:text-pixel-cream"
      >
        <span>📖 ローマ字表</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="chart"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-pixel-cream/20 p-4">
              {/* Cheat sheet from content */}
              <div className="mb-4 flex flex-wrap gap-3">
                {romajiCheatSheet.map((row) => (
                  <div key={row.kana} className="flex items-center gap-2 font-pixel text-xs">
                    <span className="text-pixel-gold">{row.kana}</span>
                    <span className="text-pixel-cream/60">→</span>
                    <span className="text-pixel-cream">{row.patterns.join(' / ')}</span>
                  </div>
                ))}
              </div>

              {/* Sokuon & ん notes */}
              <div className="space-y-1 border-t border-pixel-cream/20 pt-3 font-pixel text-xs text-pixel-cream/60">
                <p>
                  <span className="text-pixel-gold">っ</span>
                  {' '}→ 次の子音を２回 例: きって → ki<span className="text-pixel-gold">tt</span>e
                </p>
                <p>
                  <span className="text-pixel-gold">っ</span>
                  {' '}の別の入力: xtsu / ltsu
                </p>
                <p>
                  <span className="text-pixel-gold">ん</span>
                  {' '}→ nn（母音・な行の前）/ n（子音の前）
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
