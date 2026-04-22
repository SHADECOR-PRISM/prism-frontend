# ベースイメージとしてNode.jsを使用
FROM node:22-slim

# コンテナ内の作業ディレクトリ
# appフォルダの中身をここにマウントするので、場所を合わせます
WORKDIR /var/www/html

# 【重要】初期構築時は COPY や RUN npm install は不要です。
# なぜなら、起動時に「docker-compose.yml」の volumes で
# ローカルの app/ フォルダから package.json を持ってくるからです。

# 開発用サーバの起動
# ViteをDockerで動かすために '--host 0.0.0.0' を強制的に付与します
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]