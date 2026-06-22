# ZOMBIE TYPING - DETERMINATION

小学5年生がタイピングを習得するための、Undertale風ドット絵RPGタイピング練習アプリ。
目標：「鉛筆で書くより速く、自由に文章が打てる」（1分間40文字以上）

## 機能

### ゲームシステム
- Lv.1〜9 の段階的ステージ（ホームポジション → アルファベット → ローマ字基本 → 応用 → 単語 → 短文 → ひらがなのみ基本 → ひらがなのみ応用 → 自由入力）
- ゾンビが時間経過とともにプレイヤー視点で迫ってくる演出（safe / warn / danger の3段階）
- 正確に入力するとゾンビが後退、全問クリアでステージクリア
- ゲームオーバー時は「DETERMINATION...」表示と即時リトライ

### タイピング判定
- ローマ字複数表記対応（shi/si、tsu/tu/xtu/ltu/xtsu/ltsu、ja/jya/zya、など）
- 促音「っ」は子音重ね（kka、tte など）を優先ヒント表示、xtsu/ltsu/xtu/ltu も有効
- 「ん」はコンテキスト依存（子音前は n 単体可、母音前は nn 必須）
- IME非依存の自前判定

### ヒント機能
- **Lv3〜6（通常ローマ字モード）**: 2.5秒無操作 または 3回連続ミスでキーボード図をフェードイン表示。ローマ字行（TokenChip）も常時表示。
- **Lv7（ひらがなのみ 基本）**: ローマ字行は非表示。キーボード図は从来通りのミス/無操作で表示（安全網あり）。
- **Lv8（ひらがなのみ 応用）**: ローマ字行もキーボード図も完全無効。内容参照用のローマ字表（折りたたみ）は引き続き使用可。
- 正解キーを押すと即座にヒント非表示

### 成長・報酬
- ステージクリアでポイント獲得（速度・正確率ボーナス）
- 実績バッジ（はじめの一歩 / DETERMINATION / 1分40文字 / 7日連続 など）
- プレイヤーレベルアップ・アイテム解放

### こどもモード画面
- タイトル画面（親からのメッセージ表示対応）
- RPG風ステージマップ（クリア済みに✓、未解放は施錠表示）
- リザルト画面（ポイント・CPM・正確率アニメーション、NEW RECORD表示）
- プロフィール（レベル・アイテム・実績一覧）
- 記録グラフ（過去7日のCPM推移）

### おとうさんモード画面
- ダッシュボード（今日/週サマリー、詰まっているステージ確認）
- 詳細グラフ（練習時間・CPM・正確率の推移 7/30日切替）
- 子へのメッセージ送信（次回ログイン時に表示）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 19 + Vite 5 + TypeScript 6 (strict) |
| スタイリング | Tailwind CSS v3 + PostCSS |
| アニメーション | Framer Motion |
| グラフ | Recharts |
| データ保存 | localStorage（リポジトリ層で抽象化済み） |
| テスト | Vitest v2 + React Testing Library |

## 開発

```powershell
npm install
npm run dev      # 開発サーバー起動 → http://localhost:5173
```

## 品質チェック

```powershell
npm run typecheck   # TypeScript型チェック
npm run lint        # ESLint
npm run test        # ユニットテスト（55件）
npm run build       # Netlify/Bolt用ビルド
```

## 配布（手渡し用オフラインバンドル）

```powershell
npm run build:bundle
```

`dist/index.html` に JS/CSS/SVG すべてを埋め込んだ自己完結HTMLが生成されます。
このファイル1つをZIPに入れて渡せば、受け取った人がブラウザで開くだけで動きます（Node不要・サーバー不要）。

## CI/CD

Warp（開発）→ GitHub（push）→ Bolt.new（30秒ごとに自動pull・プレビュー確認）→ Netlify（本番）

## 方針

- データ保存はPhase 1ではブラウザのlocalStorageです（Phase 2でSupabaseへ差し替え可能な設計）。
- Undertaleの実アセットは使わず、フリー/自作/プログラム生成の素材に限定します。
- ゾンビSVGスプライトはプレースホルダーで、差し替え可能な構造にしています。
- ローマ字対応表・キーボード図・ステージコンテンツはコードと分離し追加容易にしています。

## ディレクトリ構成（主要部分）

```
src/
  app/          ルーティング・シェル（HashRouter + React.lazy）
  types/        ドメイン型定義
  data/         localStorageリポジトリ層
  design/       ピクセルUIプリミティブ（PixelPanel, PixelButton）
  audio/        Web Audio APIによるチップチューンSE/BGM
  game/         タイピング判定エンジン・ゲームループ・スコア計算
  content/      ステージ定義・ローマ字表・実績定義
  features/     各画面コンポーネント
  hooks/        共有Reactフック
```
