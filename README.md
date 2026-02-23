## Mahjong Stats PWA

React + Vite で動作する、**麻雀の成績管理・分析用 PWA** です。  
スマートフォンからの利用を想定した UI になっており、GitHub Pages 上で公開・インストールして使うことができます。

### 主な機能

- **対局ログの管理**
  - 日付・場所・ルール・着順・スコア・放銃回数・メモ などを記録
- **成績サマリー**
  - 対局数 / 平均着順 / トップ率 / ラス率 / 合計ポイント などを集計表示
- **プレイスタイル分析**
  - 攻撃・守備・安定感・効率・運 / 粘り などを 0–100 スコアで可視化
- **SNS シェア**
  - 対局結果を X / Facebook / LINE / Instagram など向けのテキストとして共有

### 開発環境 / 技術スタック

- **フロントエンド**: React 18, TypeScript
- **ビルドツール**: Vite
- **スタイル**: Tailwind CSS（CDN）
- **チャート / UI ライブラリ**
  - Recharts（グラフ描画）
  - lucide-react（アイコン）
  - @dnd-kit（ドラッグ＆ドロップ）
- **PWA**
  - `public/manifest.json`
  - `vite-plugin-pwa` による Service Worker 生成

### ローカルでの起動方法

**前提**: Node.js がインストールされていること

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000/` を開くとアプリを確認できます。  
ローカルではビルドやデプロイは不要で、開発は主に `npm run dev` で行います。

### 環境変数について

一部の機能では外部 API キー（例: `GEMINI_API_KEY`）を利用します。

- 実際のキーは **`.env.local` などの `.env*` ファイルに記載**し、Git にはコミットしません。
- `.env` / `.env.*` は `.gitignore` 済みです。
- 共有用には、必要に応じて `.env.example` を追加してキー名だけを残す運用を想定しています。

### デプロイ（GitHub Pages）

- GitHub Actions のワークフロー（`.github/workflows/deploy.yml`）で
  - `npm ci`
  - `npm run build`
  - GitHub Pages へのデプロイ
  を自動実行する構成になっています。
- `main` ブランチに push するだけでビルド〜デプロイまで行われる想定です。

