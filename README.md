# PRISM

**P**roject **R**esource & **I**nventory **S**ystem **M**anager

PRISM は、プロジェクト運営で発生するリソース管理、金銭管理、および付随するあらゆる事務作業を効率化・統合するために設計されたバックオフィス支援プラットフォームです。プロジェクト運営における業務フローを最適化し、透明性の高い業務遂行を実現します。

> [!IMPORTANT]
> 本リポジトリは、PRISM システムの**フロントエンド（クライアントサイド）**ソースコードを管理しています。バックエンド（API）は別リポジトリ [prism-backend](https://github.com/SHADECOR-PRISM/prism-backend) です。

## 🚀 技術スタック

開発体験の向上と爆速のビルド速度を実現するため、以下のモダンな技術を採用しています。

  - **Library:** React 19 (TypeScript)
  - **Runtime:** Node.js (v22-slim)
  - **Build Tool:** Vite
  - **UI:** MUI (Material UI) / Emotion / Framer Motion
  - **Routing:** React Router
  - **API 通信:** Axios（型・APIクライアントは OpenAPI から [Orval](https://orval.dev/) で生成）
  - **帳票・分析:** Recharts（グラフ）/ @react-pdf/renderer（PDF出力）/ ExcelJS（Excel出力）
  - **Infrastructure:** Docker / Docker Compose（開発）、Cloudflare Pages（本番ホスティング）
  - **Lint/Format:** ESLint

## 📋 主な機能

ログインしたユーザーのロール（`general` / `admin`）によって、利用できる画面が分かれます。

| ロール | 主な画面（パス） |
| --- | --- |
| 共通 | ログイン（`/login`） |
| 一般ユーザー（`general`） | 申請一覧（`/general/log`）、申請詳細・編集（`/general/log/:id`）、交通費・経費の新規申請（`/general/application/...`）、設定（`/general/setting`） |
| 管理者（`admin`） | 承認一覧・承認詳細（`/admin/approval`）、分析（`/admin/analytics`）、帳票の印刷フロー（`/admin/print/...`） |

ルーティングの定義は [`app/src/App.tsx`](app/src/App.tsx) を参照してください。仕様の詳細は後述の [ドキュメント](#-ドキュメント) にまとめています。

## 🤝 コミットメッセージ規則

本プロジェクトでは、以下の形式でコミットメッセージを記述します。

`type: description`

- `feat`: 新機能の追加
- `fix`: バグの修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない修正 (ホワイトスペース、フォーマット等)
- `refactor`: バグ修正や機能追加を含まないコードの整理
- `perf`: パフォーマンス向上のための変更
- `chore`: ビルドプロセスやドキュメント生成などの補助ツール、ライブラリの変更

## 🛠 セットアップ手順

本プロジェクトは Docker を利用して開発環境が抽象化されています。ホストマシン（Mac/Windows）への Node.js のインストールは不要です。Dockerのインストールのみ完了させてください。 **VS Code + Dev Containers** での開発を推奨しています。これにより、ローカル環境を汚さずに、チーム全員が同一の環境で開発を行えます。

### 0. 事前準備
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)（または Docker Engine）がインストールされ、起動していること。
*   VS Code 拡張機能 [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) がインストールされていること。


### 1. リポジトリのクローン

```bash
git clone https://github.com/SHADECOR-PRISM/prism-frontend.git
cd prism-frontend
```

### 2. コンテナの構築とパッケージインストール

新規パッケージが必要な場合`dockerfile`を書き換えてください。

1.  プロジェクトのルートディレクトリを VS Code で開きます。
2.  画面右下に「コンテナで作成して再度開く（Reopen in Container）」という通知が表示されるので、それをクリックします。
    *   表示されない場合は、`F1` キー（または `Cmd+Shift+P`）を押し、**「Dev Containers: Reopen in Container」** を実行してください。
3.  初回起動時はコンテナのビルドとパッケージインストール（`npm install`）が自動で行われるため、数分かかります。

> [!TIP]
> **パッケージや環境の更新について**
> - **ライブラリを追加した場合**: `package.json` を編集後、コンテナ内のターミナルで `npm install` を実行してください。
> - **設定を変更した場合**: `Dockerfile.dev` や `devcontainer.json` を変更した場合は、コマンドパレットから **「Dev Containers: Rebuild Container」** を実行して環境を更新してください。


### 3. 開発サーバーへのアクセス

起動後は、ブラウザで以下のURLにアクセスしてください。

  - [http://localhost:3000](http://localhost:3000)

> [!NOTE]
> ログインや一覧取得などの API を使う画面は、[prism-backend](https://github.com/SHADECOR-PRISM/prism-backend) が起動していないと動作しません（ローカルの既定では `http://localhost:8000`）。バックエンドの起動方法は、prism-backend の README を参照してください。

### 4. よく使うコマンド

コンテナ内のターミナルで、`app/` ディレクトリを基準に実行します。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動（Vite。コンテナ内はポート 5173、ホストには 3000 で公開） |
| `npm run build` | 型チェック（`tsc -b`）＋本番ビルド（`dist/` に出力） |
| `npm run lint` | ESLint による静的解析 |
| `npm run preview` | ビルド結果のローカルプレビュー |
| `npm run orval` | OpenAPI スキーマから型・APIクライアントを再生成（後述） |


## 📂 ディレクトリ構成

```text
prism-frontend/
├── .devcontainer         # Dev container設定用ファイル
├── docker/               # 実行環境設定（Dockerfile等）
├── app/                  # フロントエンド・アプリケーション本体
│   ├── src/              # React コンポーネントおよびロジック
│   │   ├── api/          # Axios 設定、Orval 生成物（generated/）
│   │   ├── components/   # 共通コンポーネント（elements/, layouts/ 等）
│   │   ├── features/     # 機能単位のコンポーネント・hooks・ユーティリティ（accounting/）
│   │   ├── pages/        # 画面（general/, admin/, login）
│   │   └── App.tsx       # ルーティング・認証初期化
│   ├── openapi/          # バックエンドの OpenAPI スキーマ（Orval の入力）
│   ├── public/           # 静的アセット
│   ├── orval.config.ts   # Orval 設定
│   ├── wrangler.jsonc    # Cloudflare 配信設定（SPA フォールバック）
│   └── vite.config.ts    # Vite 設定
├── docker-compose.yml    # 環境オーケストレーション
└── README.md             # 本ドキュメント
```

## 💡 開発ガイド

### 1. ブランチ運用とPR
*   `main` ブランチへの直接プッシュは禁止されています。
*   新しい作業を始める際は、必ず `feat/feature-name` や `fix/bug-name` といった名前でブランチを切ってください。
*   プルリクエスト（PR）作成時は、最小限の機能単位で作成し、レビュアーを指定してください。

### 2. 環境変数の扱い
API エンドポイントなどの設定値は `.env` ファイルで管理します。

1. `app/.env` を作成し、以下を記載してください（現在 `.env.example` はリポジトリにありません）。
   ```env
   # バックエンド API の URL
   VITE_API_BASE_URL=http://localhost:8000
   ```
2. `.env` は GitHub にコミットしないでください（`.gitignore` で除外済みです）。

| 変数 | 内容 | 備考 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | バックエンド API のベース URL | 未設定だと API 通信ができません。Vite が**ビルド時に埋め込む**ため、変更後は再起動（本番は再デプロイ）が必要です。 |

本番（Cloudflare Pages）では、同名の変数を Pages の **Build** 側の環境変数に設定します（Cloud Run の URL）。

### 3. API 型の更新（バックエンドの API を変更したとき）
バックエンドの API 仕様が変わった場合は、フロントエンドの型・API クライアントを再生成します。`src/api/generated/` は自動生成物のため、**直接編集しないでください**。

1. バックエンド側で `openapi.json` を再生成する（`python scripts/export_openapi.py`）
2. 生成された内容を、このリポジトリの `app/openapi/schema.json` に反映する
3. `npm run orval` を実行し、差分をコミットする

詳細な運用フローは、[ドキュメント](#-ドキュメント)の `openapi-orval-workflow.md` を参照してください。

### 4. デプロイ
`main` ブランチへのマージで、Cloudflare Pages が自動でビルド・配信します。本番の設定・手順・動作確認は、[ドキュメント](#-ドキュメント)の `deployment-guide.md` と `deploy-verification-checklist.md` を参照してください。

## 📚 ドキュメント

設計・仕様・運用に関するドキュメントは、別リポジトリ [prism-docs](https://github.com/SHADECOR-PRISM/prism-docs) にまとめています。

| 知りたいこと | ドキュメント |
| --- | --- |
| システム全体の仕様 | `current-system-spec.md` |
| ファイル単位の役割・依存関係 | `dev-guide/prism-frontend/...` |
| 本番デプロイの手順 | `deployment-guide.md` |
| API 型の更新フロー | `openapi-orval-workflow.md` |

-----

© 2026 SHADECOR / PRISM Project Team