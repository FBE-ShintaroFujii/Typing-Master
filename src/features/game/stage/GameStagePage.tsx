import { useParams } from 'react-router-dom'
import { stageDefinitions } from '../../../content/index.ts'
import { PixelPanel } from '../../../design/index.ts'

export function GameStagePage() {
  const { id } = useParams()
  const stage = stageDefinitions.find((candidate) => candidate.id === id) ?? stageDefinitions[0]

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <PixelPanel className="space-y-4">
        <p className="font-pixel text-pixel-red">ゾンビが近づいてくる……</p>
        <h1 className="font-pixel text-2xl text-pixel-gold">{stage.title}</h1>
        <p>{stage.description}</p>
        <p className="rounded bg-pixel-night p-4 text-2xl">{stage.prompts[0]?.label}</p>
        <p className="text-sm text-pixel-cream/70">M1でタイピングエンジンと演出を接続します。</p>
      </PixelPanel>
    </div>
  )
}
