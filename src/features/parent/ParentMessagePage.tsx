import { PixelPanel } from '../../design/index.ts'

export function ParentMessagePage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <PixelPanel>
        <h1 className="font-pixel text-3xl text-pixel-gold">メッセージ</h1>
        <p>次回ログイン時に表示するメッセージ欄をM1で実装します。</p>
      </PixelPanel>
    </div>
  )
}
