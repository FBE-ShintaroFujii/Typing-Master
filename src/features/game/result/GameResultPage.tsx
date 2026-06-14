import { PixelPanel } from '../../../design/index.ts'

export function GameResultPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <PixelPanel className="space-y-4 text-center">
        <h1 className="font-pixel text-3xl text-pixel-gold">RESULT</h1>
        <p>M1でポイント、NEW RECORD、実績表示を実装します。</p>
      </PixelPanel>
    </div>
  )
}
