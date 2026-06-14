import { Link } from 'react-router-dom'
import { stageDefinitions } from '../../../content/index.ts'
import { PixelButton, PixelPanel } from '../../../design/index.ts'

export function GameMapPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="font-pixel text-3xl text-pixel-gold">ステージマップ</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {stageDefinitions.map((stage) => (
          <PixelPanel key={stage.id} className="space-y-3">
            <h2 className="font-pixel text-lg text-pixel-cream">{stage.title}</h2>
            <p>{stage.description}</p>
            <Link to={`/game/stage/${stage.id}`}><PixelButton>はじめる</PixelButton></Link>
          </PixelPanel>
        ))}
      </div>
    </div>
  )
}
