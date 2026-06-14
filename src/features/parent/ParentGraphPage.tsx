import { PixelPanel } from '../../design/index.ts'

export function ParentGraphPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <PixelPanel>
        <h1 className="font-pixel text-3xl text-pixel-gold">詳細グラフ</h1>
        <p>練習時間・文字数・正確率の推移をM1で実装します。</p>
      </PixelPanel>
    </div>
  )
}
