import { Link } from 'react-router-dom'
import { PixelButton, PixelPanel } from '../../design/index.ts'

export function ParentDashboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <PixelPanel className="space-y-4">
        <h1 className="font-pixel text-3xl text-pixel-gold">おとうさんダッシュボード</h1>
        <p>日別・週別サマリーをM1で実装します。</p>
        <div className="flex gap-3">
          <Link to="/parent/graph"><PixelButton>詳細グラフ</PixelButton></Link>
          <Link to="/parent/message"><PixelButton>メッセージ</PixelButton></Link>
        </div>
      </PixelPanel>
    </div>
  )
}
