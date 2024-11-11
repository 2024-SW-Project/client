import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'; // svgr 추가

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    open: '/subway/search' // 개발 서버 시작시 자동으로 열릴 경로
  }
})
