import { Link } from 'react-router-dom'
import { PixelButton, PixelPanel } from '../../design/index.ts'

export function TitlePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 p-6 text-center">
      <PixelPanel className="space-y-6">
        <p className="font-pixel text-sm text-pixel-red">ZOMBIE TYPING</p>
        <h1 className="font-pixel text-3xl leading-relaxed text-pixel-gold md:text-5xl">DETERMINATION</h1>
        <p className="text-lg">鉛筆より速く、思ったことを文章で打てるようになる練習アプリ。</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/game/map"><PixelButton>こどもモード</PixelButton></Link>
          <Link to="/parent/dashboard"><PixelButton>おとうさんモード</PixelButton></Link>
        </div>
      </PixelPanel>
    </div>
  )
}
