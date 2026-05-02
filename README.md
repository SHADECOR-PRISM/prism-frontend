# PRISM

**P**roject **R**esource & **I**nventory **S**ystem **M**anager

PRISM は、プロジェクト運営で発生するリソース管理、金銭管理、および付随するあらゆる事務作業を効率化・統合するために設計されたバックオフィス支援プラットフォームです。プロジェクト運営における業務フローを最適化し、透明性の高い業務遂行を実現します。

> [\!IMPORTANT]  
> 本リポジトリは、PRISM システムの\*\*フロントエンド（クライアントサイド）\*\*ソースコードを管理しています。

## 🚀 技術スタック

開発体験の向上と爆速のビルド速度を実現するため、以下のモダンな技術を採用しています。

  - **Library:** React (TypeScript)
  - **Runtime:** Node.js (v22-slim)
  - **Build Tool:** Vite
  - **Infrastructure:** Docker / Docker Compose
  - **Lint/Format:** ESLint

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

### 0\. 事前準備
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)（または Docker Engine）がインストールされ、起動していること。
*   VS Code 拡張機能 [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) がインストールされていること。


### 1\. リポジトリのクローン

```bash
git clone https://github.com/SHADECOR-PRISM/prism-frontend.git
cd prism-frontend
```

### 2\. コンテナの構築とパッケージインストール

新規パッケージが必要な場合`dockerfile`を書き換えてください。

1.  プロジェクトのルートディレクトリを VS Code で開きます。
2.  画面右下に「コンテナで作成して再度開く（Reopen in Container）」という通知が表示されるので、それをクリックします。
    *   表示されない場合は、`F1` キー（または `Cmd+Shift+P`）を押し、**「Dev Containers: Reopen in Container」** を実行してください。
3.  初回起動時はコンテナのビルドとパッケージインストール（`npm install`）が自動で行われるため、数分かかります。

> [!TIP]
> **パッケージや環境の更新について**
> - **ライブラリを追加した場合**: `package.json` を編集後、コンテナ内のターミナルで `npm install` を実行してください。
> - **設定を変更した場合**: `Dockerfile.dev` や `devcontainer.json` を変更した場合は、コマンドパレットから **「Dev Containers: Rebuild Container」** を実行して環境を更新してください。


### 3\. 開発サーバーへのアクセス

起動後は、ブラウザで以下のURLにアクセスしてください。

  - [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)


## 📂 ディレクトリ構成

```text
prism-frontend/
├── .devcontainer         # Dev container設定用ファイル
├── docker/               # 実行環境設定（Dockerfile等）
├── app/                  # フロントエンド・アプリケーション本体
│   ├── src/              # React コンポーネントおよびロジック
│   ├── public/           # 静的アセット
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
API エンドポイントなどの機密情報は `.env` ファイルで管理します。
1. `app/.env.example` をコピーして `app/.env` を作成してください。
2. `.env` は GitHub にコミットしないでください（`.gitignore` で除外済みです）。

-----

© 2026 SHADECOR / PRISM Project Team