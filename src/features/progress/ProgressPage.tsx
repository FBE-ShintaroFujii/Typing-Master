import { PixelPanel } from '../../design/index.ts'

export function ProgressPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <PixelPanel>
        <h1 className="font-pixel text-3xl text-pixel-gold">練習記録</h1>
        <p>文字数・正確率・タイムのグラフをM1で実装します。</p>
      </PixelPanel>
    </div>
  )
}
