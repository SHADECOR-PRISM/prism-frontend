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

本プロジェクトは Docker を利用して開発環境が抽象化されています。ホストマシン（Mac/Windows）への Node.js のインストールは不要です。Dockerのインストールのみ完了させてください。

### 1\. リポジトリのクローン

```bash
git clone https://github.com/your-org-name/prism.git
cd prism
```

### 2\. コンテナの構築とパッケージインストール

初回起動時、および `package.json` を更新した際は、必ず以下の手順を実行してコンテナ内のボリュームに依存関係をインストールしてください。

```bash
# コンテナイメージのビルド
docker compose build

# パッケージのインストール
docker compose run --rm frontend npm install
```

### 3\. 開発サーバーの起動

コンテナを起動し、ローカル開発サーバーを立ち上げます。

```bash
docker compose up
```

起動後、ブラウザで以下のURLにアクセスしてください。

  - [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

## 📂 ディレクトリ構成

```text
prism-frontend/
├── docker/               # 実行環境設定（Dockerfile等）
├── app/                  # フロントエンド・アプリケーション本体
│   ├── src/              # React コンポーネントおよびロジック
│   ├── public/           # 静的アセット
│   └── vite.config.ts    # Vite 設定
├── docker-compose.yml    # 環境オーケストレーション
└── README.md             # 本ドキュメント
```

## 💡 開発ガイド

### 新しいライブラリの追加

ホストの `node_modules` は使用せず、必ずコンテナ経由でインストールを行ってください。

```bash
docker compose run --rm frontend npm install <package-name>
```

### コンテナの停止

ターミナルで `Ctrl + C` を入力するか、別のターミナルから以下を実行します。

```bash
docker compose stop
```

-----

© 2026 SHADECOR / PRISM Project Team