import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { stageDefinitions } from '../../../content/index.ts'
import {
  LocalStorageProgressRepository,
} from '../../../data/index.ts'
import { PixelButton, PixelPanel } from '../../../design/index.ts'
import {
  calculateScore,
  createTypingState,
  gameLoopReducer,
  getDangerTier,
  getElapsedSeconds,
  getRemainingRomajiCount,
  initialGameLoopState,
  processKey,
  tokenizeInput,
  ZOMBIE_SPEED_PER_SECOND,
} from '../../../game/index.ts'
import type { TypingState } from '../../../game/index.ts'
import type { SessionRecord } from '../../../types/index.ts'
import { ChiptuneAudioManager } from '../../../audio/index.ts'
import type { AudioCue } from '../../../audio/index.ts'
import { usePlayerContext } from '../../../app/PlayerContext.tsx'
import { ZombieApproach } from './ZombieApproach.tsx'
import { checkAchievements, applyNewAchievements } from '../../../shared/utils/checkAchievements.ts'
import { getZombieModifier } from '../../../shared/utils/getZombieModifier.ts'
import { rewardItems } from '../../../content/index.ts'
import { DEFAULT_ATTACK_STYLE } from '../../../types/attack.ts'
import type { AttackStyle } from '../../../types/attack.ts'
import type { ZombieModifier } from '../../../types/zombieModifier.ts'
import { PromptDisplay } from './PromptDisplay.tsx'
import { KeyHint } from './KeyHint.tsx'
import { getNextKeys } from './keyHintUtils.ts'
import { RomajiChartPanel } from './RomajiChartPanel.tsx'
import { ClearOverlay, GameOverOverlay } from './GameOverlay.tsx'

// ── Sound effects ─────────────────────────────────────────────────────────────

const SFX = {
  correct: { frequency: 880, durationMs: 40, type: 'square' } satisfies AudioCue,
  tokenComplete: { frequency: 1100, durationMs: 60, type: 'square' } satisfies AudioCue,
  mistake: { frequency: 180, durationMs: 120, type: 'sawtooth' } satisfies AudioCue,
  wordComplete: { frequency: 1320, durationMs: 80, type: 'square' } satisfies AudioCue,
  clear: { frequency: 1760, durationMs: 400, type: 'square' } satisfies AudioCue,
  gameover: { frequency: 110, durationMs: 600, type: 'sawtooth' } satisfies AudioCue,
} as const

// ── Component ─────────────────────────────────────────────────────────────────

export function GameStagePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const stage = useMemo(
    () => stageDefinitions.find((s) => s.id === (id ?? '')) ?? stageDefinitions[0],
    [id],
  )

  // ── Game loop state (pure reducer) ──────────────────────────────────────────
  const [loop, dispatch] = useReducer(gameLoopReducer, initialGameLoopState)
  // Refs are updated via useLayoutEffect (not during render) to satisfy react-hooks/refs
  const loopRef = useRef(loop)
  useLayoutEffect(() => { loopRef.current = loop })

  // ── Typing engine state ──────────────────────────────────────────────────────
  const [typingState, setTypingState] = useState<TypingState | null>(null)
  const typingStateRef = useRef(typingState)
  useLayoutEffect(() => { typingStateRef.current = typingState })

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [mistakeFlash, setMistakeFlash] = useState(false)
  const [remainingOnGameover, setRemainingOnGameover] = useState(0)
  const [scoreResult, setScoreResult] = useState<{ points: number; accuracy: number } | null>(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [freeText, setFreeText] = useState('')
  const [hintVisible, setHintVisible] = useState(false)
  const [hitTrigger, setHitTrigger] = useState(0)

  // Get the player-specific storage key once at mount.
  const { storageKey } = usePlayerContext()

  // Derive attack style and zombie modifier from equipped items (read once on mount).
  const [attackStyle] = useState<AttackStyle>(() => {
    const repo = new LocalStorageProgressRepository(storageKey)
    const snap = repo.load()
    const weapon = rewardItems.find(
      item => item.category === 'weapon' && snap.profile.equippedItemIds.includes(item.id),
    )
    return weapon?.attackStyle ?? DEFAULT_ATTACK_STYLE
  })

  const [zombieModifier] = useState<ZombieModifier>(() => {
    const repo = new LocalStorageProgressRepository(storageKey)
    const snap = repo.load()
    return getZombieModifier(snap.profile.equippedItemIds)
  })

  // ── Refs ──────────────────────────────────────────────────────────────────────
  const audioRef = useRef(new ChiptuneAudioManager())
  const rafRef = useRef(0)
  const lastTickRef = useRef(0)
  const sessionRef = useRef<SessionRecord | null>(null)
  const newAchievementsRef = useRef<string[]>([])
  const endedRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Keep storageKey in a ref so RAF/callback closures always use the current value
  const storageKeyRef = useRef(storageKey)
  useLayoutEffect(() => { storageKeyRef.current = storageKey })
  // ── Hint tracking ─────────────────────────────────────────────────────────
  const lastInputAt = useRef<number>(0)
  const consecutiveMistakesRef = useRef(0)

  // ── Derived ───────────────────────────────────────────────────────────────────
  const isFree = stage.inputMode === 'free'
  const isRomaji = stage.inputMode === 'romaji'
  const currentPrompt = stage.prompts[loop.promptIndex] ?? stage.prompts[stage.prompts.length - 1]
  const dangerTier = getDangerTier(loop.zombieDistance)

  // ── endGame (uses refs to avoid stale closures) ───────────────────────────────
  // pendingCorrect: the 'correct' dispatch for the final key hasn't been batched yet
  // when endGame is called from the keyboard handler — add 1 for the clear case.
  const endGame = useCallback(
    (cleared: boolean, pendingCorrect = 0) => {
      if (endedRef.current) return
      endedRef.current = true

      const now = performance.now()
      const lp = loopRef.current
      const elapsed = lp.startedAt ? getElapsedSeconds(lp, now) : 1

      const score = calculateScore({
        durationSeconds: elapsed,
        typedChars: lp.typedChars + pendingCorrect,
        correctChars: lp.correctChars + pendingCorrect,
        mistakeCount: lp.mistakeCount,
        cleared,
      })

      const record: SessionRecord = {
        id: crypto.randomUUID(),
        stageId: stage.id,
        startedAt: new Date(Date.now() - elapsed * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: elapsed,
        typedChars: lp.typedChars,
        correctChars: lp.correctChars,
        mistakeCount: lp.mistakeCount,
        accuracy: score.accuracy,
        charsPerMinute: score.charsPerMinute,
        cleared,
        pointsEarned: score.points,
      }
      sessionRef.current = record

      // Persist via repository scoped to the current player
      const repo = new LocalStorageProgressRepository(storageKeyRef.current)
      const snapshot = repo.load()
      const prevBest = snapshot.sessions
        .filter((s) => s.stageId === stage.id && s.cleared)
        .reduce((max, s) => Math.max(max, s.charsPerMinute), 0)
      const isNew = cleared && score.charsPerMinute > prevBest

      snapshot.sessions = [...snapshot.sessions, record]
      if (cleared) {
        snapshot.profile = {
          ...snapshot.profile,
          totalPoints: snapshot.profile.totalPoints + score.points,
          updatedAt: new Date().toISOString(),
        }
      }
      repo.save(snapshot)

      // Evaluate achievement conditions on the updated snapshot
      const newAchievementIds = checkAchievements(snapshot)
      if (newAchievementIds.length > 0) {
        repo.save(applyNewAchievements(snapshot, newAchievementIds))
      }
      newAchievementsRef.current = newAchievementIds

      setIsNewRecord(isNew)
      setScoreResult({ points: score.points, accuracy: score.accuracy })

      if (cleared) {
        dispatch({ type: 'clear', now })
        audioRef.current.playCue(SFX.clear, 0.35)
      } else {
        dispatch({ type: 'gameover', now })
        audioRef.current.playCue(SFX.gameover, 0.35)
      }
    },
    [stage],
  )

  // ── Start game ────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    // Increment retryCount when restarting after a game over (for DETERMINATION achievement)
    if (loopRef.current.phase === 'gameover') {
      const retryRepo = new LocalStorageProgressRepository(storageKeyRef.current)
      const retrySnap = retryRepo.load()
      retryRepo.save({ ...retrySnap, retryCount: retrySnap.retryCount + 1 })
    }
    endedRef.current = false
    newAchievementsRef.current = []
    dispatch({ type: 'start', now: performance.now() })
    setTypingState(createTypingState(stage.prompts[0].expected, stage.inputMode))
    setScoreResult(null)
    setIsNewRecord(false)
    setMistakeFlash(false)
    setFreeText('')
    lastInputAt.current = Date.now()
    consecutiveMistakesRef.current = 0
    setHintVisible(false)
    setHitTrigger(0)
  }, [stage])

  // ── Auto-focus textarea when free mode starts ───────────────────────────────
  useEffect(() => {
    if (loop.phase === 'playing' && isFree) {
      textareaRef.current?.focus()
    }
  }, [loop.phase, isFree])

  // ── Keyboard handler (registered once per phase change) ──────────────────────
  useEffect(() => {
    if (loop.phase !== 'playing') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return

      // Free mode: native textarea handles all input (IME, backspace, enter, etc.)
      if (isFree) return

      if (e.key.length !== 1) return
      e.preventDefault()

      const ts = typingStateRef.current
      if (!ts) return

      const key = e.key.toLowerCase()
      const { result, state: nextState } = processKey(ts, key)

      if (result === 'mistake') {
        dispatch({ type: 'mistake' })
        setMistakeFlash(true)
        setTimeout(() => setMistakeFlash(false), 300)
        audioRef.current.playCue(SFX.mistake)
        lastInputAt.current = Date.now()
        consecutiveMistakesRef.current += 1
        if (consecutiveMistakesRef.current >= 3) setHintVisible(true)
        return
      }

      // Correct key — reset hint
      lastInputAt.current = Date.now()
      consecutiveMistakesRef.current = 0
      setHintVisible(false)
      dispatch({ type: 'correct', extraRetreat: zombieModifier.retreatBonus })

      if (result === 'word-complete') {
        setHitTrigger((n) => n + 1)
        const lp = loopRef.current
        const nextPromptIndex = lp.promptIndex + 1
        if (nextPromptIndex >= stage.prompts.length) {
          endGame(true, 1) // +1 for this key (dispatch not yet batched)
        } else {
          dispatch({ type: 'wordComplete', extraRetreat: zombieModifier.wordRetreatBonus })
          setTypingState(createTypingState(stage.prompts[nextPromptIndex].expected, stage.inputMode))
          audioRef.current.playCue(SFX.wordComplete)
        }
      } else {
        if (result === 'token-complete') setHitTrigger((n) => n + 1)
        setTypingState(nextState)
        audioRef.current.playCue(
          result === 'token-complete' ? SFX.tokenComplete : SFX.correct,
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [loop.phase, isFree, stage, endGame, zombieModifier])

  // ── RAF zombie tick ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (loop.phase !== 'playing') {
      cancelAnimationFrame(rafRef.current)
      return
    }
    const speed = ZOMBIE_SPEED_PER_SECOND[stage.zombieSpeed]
    if (speed === 0) return

    const tick = (now: number) => {
      const delta = Math.min((now - lastTickRef.current) / 1000, 0.1)
      lastTickRef.current = now
      dispatch({ type: 'tick', deltaSeconds: delta * speed * zombieModifier.speedMultiplier })
      rafRef.current = requestAnimationFrame(tick)
    }
    lastTickRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loop.phase, stage.zombieSpeed, zombieModifier])

  // ── Inactivity hint timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (loop.phase !== 'playing') return
    const id = setInterval(() => {
      if (Date.now() - lastInputAt.current > 2500) {
        setHintVisible(true)
      }
    }, 100)
    return () => clearInterval(id)
  }, [loop.phase])

  // ── Detect gameover when zombie reaches 0 ─────────────────────────────────────
  useEffect(() => {
    if (loop.phase !== 'playing' || loop.zombieDistance > 0) return

    const ts = typingStateRef.current
    const currentRemaining = ts ? getRemainingRomajiCount(ts) : 0
    const lp = loopRef.current
    const futureChars = stage.prompts.slice(lp.promptIndex + 1).reduce((sum, p) => {
      return (
        sum +
        tokenizeInput(p.expected, stage.inputMode).reduce(
          (s, t) => s + (t.romajis[0]?.length ?? 1),
          0,
        )
      )
    }, 0)
    setRemainingOnGameover(currentRemaining + futureChars)
    endGame(false)
  }, [loop.phase, loop.zombieDistance, stage, endGame])

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleGoToResult = () => {
    navigate('/game/result', {
      state: { session: sessionRef.current, newAchievementIds: newAchievementsRef.current },
    })
  }

  const handleFinishFree = () => {
    endGame(true)
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/game/map"
          className="font-pixel text-xs text-pixel-cream/50 hover:text-pixel-cream"
        >
          ← マップ
        </Link>
        <h1 className="font-pixel text-base text-pixel-gold">{stage.title}</h1>
        <div className="font-pixel text-xs text-pixel-cream/50">
          {Math.min(loop.promptIndex + 1, stage.prompts.length)}/{stage.prompts.length}
        </div>
      </div>

      {/* Zombie approach — player-perspective view */}
      {stage.zombieSpeed !== 'none' && loop.phase !== 'idle' && (
        <ZombieApproach
          zombieDistance={loop.zombieDistance}
          tier={dangerTier}
          hitTrigger={hitTrigger}
          attackStyle={attackStyle}
        />
      )}

      {/* Main play area */}
      <PixelPanel className="relative min-h-52">
        {/* ── Idle: start screen ── */}
        {loop.phase === 'idle' && (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <p className="max-w-xs text-pixel-cream/70">{stage.description}</p>
            {stage.zombieSpeed !== 'none' && (
              <p className="font-pixel text-sm text-pixel-red">ゾンビが近づいてくる……！</p>
            )}
            <PixelButton onClick={startGame} className="text-pixel-green">
              ▶ スタート
            </PixelButton>
          </div>
        )}

        {/* ── Playing ── */}
        {loop.phase === 'playing' && (
          <>
            {isFree ? (
              // Free mode: native textarea with full IME support
              <div className="space-y-4 pb-10">
                <p className="text-center font-pixel text-xl text-pixel-cream">
                  {currentPrompt.label}
                </p>
                <textarea
                  ref={textareaRef}
                  value={freeText}
                  rows={6}
                  onChange={(e) => {
                    const newText = e.target.value
                    if (newText.length > freeText.length) {
                      dispatch({ type: 'correct', extraRetreat: zombieModifier.retreatBonus })
                      lastInputAt.current = Date.now()
                      consecutiveMistakesRef.current = 0
                    }
                    setFreeText(newText)
                  }}
                  className="w-full rounded border-2 border-pixel-cream/30 bg-pixel-night p-3 font-pixel text-pixel-cream resize-none focus:border-pixel-cream/50 focus:outline-none"
                  placeholder="ひらがな・かんじ・abc、なんでもどうぞ…"
                />
                <div className="flex justify-center">
                  <PixelButton onClick={handleFinishFree}>完了</PixelButton>
                </div>
              </div>
            ) : (
              typingState && (
                <>
                  <PromptDisplay
                    label={currentPrompt.label}
                    typingState={typingState}
                    mistake={mistakeFlash}
                  />
                  <KeyHint
                    nextKeys={getNextKeys(typingState.tokens, typingState.tokenIndex, typingState.typed)}
                    visible={hintVisible}
                  />
                </>
              )
            )}

            {/* Stats row */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-around font-pixel text-xs text-pixel-cream/40">
              <span>ミス: {loop.mistakeCount}</span>
              <span>
                正確率:{' '}
                {loop.typedChars > 0
                  ? Math.round((loop.correctChars / loop.typedChars) * 100)
                  : 100}
                %
              </span>
              <span>入力: {loop.correctChars}</span>
            </div>
          </>
        )}

        {/* ── Overlays ── */}
        {loop.phase === 'gameover' && (
          <GameOverOverlay
            remainingChars={remainingOnGameover}
            onRetry={startGame}
            onMap={() => navigate('/game/map')}
          />
        )}
        {loop.phase === 'clear' && scoreResult && (
          <ClearOverlay
            isNewRecord={isNewRecord}
            points={scoreResult.points}
            accuracy={scoreResult.accuracy}
            onResult={handleGoToResult}
            onRetry={startGame}
          />
        )}
      </PixelPanel>

      {/* Romaji reference chart */}
      {(isRomaji || stage.inputMode === 'direct') && (
        <RomajiChartPanel defaultOpen={stage.level <= 3} />
      )}
    </div>
  )
}
