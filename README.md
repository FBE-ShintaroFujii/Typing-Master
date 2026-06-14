# ZOMBIE TYPING - DETERMINATION

小学生向けのローカル完結タイピング練習アプリです。完成までは非公開で開発し、最終成果物は単一HTMLバンドルをZIP化して手渡しします。

## 開発

```powershell
npm install
npm run dev
```

## 品質チェック

```powershell
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

## 配布

`npm run build` で `dist/index.html` に自己完結の単一HTMLを生成します。配布時は `dist/index.html` をZIPに入れ、受け取った人がブラウザで開ける形にします。

## 方針

- GitHub push、Bolt.new、Netlify、Vercel は今回のプロジェクトでは使いません。
- データ保存はPhase 1ではブラウザのlocalStorageです。
- Undertaleの実アセットは使わず、フリー/自作/プログラム生成の素材に限定します。
