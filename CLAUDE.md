# CLAUDE.md（prism-frontend）

PRISM（Project Resource & Inventory System Manager）のフロントエンド。React 19 + TypeScript + Vite + MUI。バックエンド（FastAPI）は別リポジトリ `prism-backend`。コードは `app/` 配下にあり、コマンドは `app/` を基準に実行する。

## ブランチ運用（必須）

- 枝は必ず `main` → `develop` → `feat/...`（`fix/...` `chore/...` `docs/...` など）の順に伸ばす。作業ブランチは **`develop` から切る**。
- 修正は必ず `develop` にマージし、`develop` から `main` にマージする。作業ブランチを直接 `main` にマージしない。`main` への直接 push も禁止。
- ブランチは機能単位で分け、PR は最小限の機能単位で作る。
- コミットメッセージは `type: description`（`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `chore`）。

## よく使うコマンド（`app/` で実行）

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー（Vite） |
| `npm run lint` | ESLint |
| `npm run build` | `tsc -b` による型チェック + 本番ビルド |
| `npm run orval` | OpenAPI スキーマから型・APIクライアントを再生成 |

PR では CI が `npm ci` → `npm run lint` → `npm run build`（Node 22）を実行する。PR 前にローカルで lint と build が通ることを確認する。テストコードは現在ない。

## 構成

- `src/App.tsx` — ルーティングと認証の初期化。ロールは `general` / `admin`。
- `src/pages/{general,admin}/accounting/` — 画面。`src/features/accounting/` — 機能単位の components / hooks / utils / types。
- `src/components/layouts/` — `MainLayout`（Header + Footer）、`HeaderOnlyLayout`（戻る矢印のみ）、`BlankLayout`。
- `src/api/generated/` — Orval の生成物。**手で編集しない。**
- `src/api/axiosInstance.tsx` — Axios 設定。アクセストークンはメモリ保持（`setAccessToken`）、リフレッシュトークンは HttpOnly Cookie。トークンを localStorage / sessionStorage に入れない。

## API 型の同期

バックエンドの API を変えたら、backend で `python scripts/export_openapi.py` を実行し、出力された `openapi.json` を `app/openapi/schema.json` にコピーして `npm run orval` を実行する。生成差分を確認し、`npm run build` で型エラーがないか確かめてからコミットする。

## 実装上の方針

- 変更は、触るファイルの中で完結する最小の差分にする。新しいコンポーネント・Context・ユーティリティのファイルは、必要なとき（または依頼があったとき）だけ追加する。
- 既存ファイルの改行コード（CRLF のファイルがある）を変えない。編集後に `git diff --stat` で全行が差分になっていないか確認する。
- `**/test/` は `.gitignore` で除外される。ローカルの実験用コードはそこに置き、コミットしない。
- 環境変数は `app/.env`（`VITE_API_BASE_URL`）。`.env` はコミットしない。
- ソースを変更したら、対応する `docs/dev-guide/`（親ディレクトリの `docs/`）のドキュメントも手動で更新する。
