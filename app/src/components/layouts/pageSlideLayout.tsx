import { useLocation, useOutlet, matchPath } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * スライド対象とするパスのパターン一覧
 */
const SLIDE_PATH_PATTERNS = [
  '/general/log/:id',
  '/admin/approval/:id',
  '/admin/print/setting',
];

// スマートフォン実機を想定したモックアップ枠のサイズ（iPhone Pro Max 相当）
const MOBILE_FRAME_WIDTH = 430;
const MOBILE_FRAME_HEIGHT = 932;
// この幅以下は実機のスマートフォンとみなし、モックアップ枠を使わず全画面表示する
const MOBILE_BREAKPOINT = 480;

export default function PageSlideLayout() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const isMobileViewport = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT}px)`);

  // 現在の URL パスが SLIDE_PATH_PATTERNS のいずれかにマッチするか判定
  const isSlideTarget = SLIDE_PATH_PATTERNS.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );

  const screen = (
    <AnimatePresence mode="popLayout" initial={false}>
      {isSlideTarget ? (
        /* 💡 スライド対象画面：key に location.pathname を指定して差分検知させる */
        <motion.div
          key={location.pathname}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          {currentOutlet}
        </motion.div>
      ) : (
        /* 通常画面（タブ切り替え等）：即座に表示 */
        <Box key="static-outlet" sx={{ width: '100%', height: '100%' }}>
          {currentOutlet}
        </Box>
      )}
    </AnimatePresence>
  );

  // スマートフォン実機での閲覧時：これまで通り画面いっぱいに表示する
  if (isMobileViewport) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100dvh',
          overflow: 'hidden',
          bgcolor: '#F9F9F9',
        }}
      >
        {screen}
      </Box>
    );
  }

  // PC・タブレット等の広い画面：スマートフォンのモックアップ枠に収めて中央表示する
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#2b2b30',
        boxSizing: 'border-box',
        p: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          flexShrink: 0,
          width: MOBILE_FRAME_WIDTH,
          height: `min(${MOBILE_FRAME_HEIGHT}px, 100%)`,
          boxSizing: 'border-box',
          border: '12px solid #0b0b0d',
          borderRadius: '48px',
          bgcolor: '#F9F9F9',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* ノッチ（スマートフォン筐体風の装飾） */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 22,
            bgcolor: '#0b0b0d',
            borderRadius: '0 0 14px 14px',
            zIndex: 20,
          }}
        />

        {screen}
      </Box>
    </Box>
  );
}
