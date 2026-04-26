import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Dockerコンテナの外からアクセスできるようにする
    port: 5173,      // コンテナ内のポート
    watch: {
      usePolling: true, // Windows側の変更を検知するための「強制監視」モード
      interval: 100,    // 0.1秒ごとにチェック
    },
  },
})
