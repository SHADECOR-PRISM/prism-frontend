import { useLocation, useOutlet, matchPath } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Box from '@mui/material/Box';

/**
 * スライド対象とするパスのパターン一覧
 */
const SLIDE_PATH_PATTERNS = [
  '/general/log/:id',
  '/admin/approval/:id',
];

export default function PageSlideLayout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  // 現在の URL パスが SLIDE_PATH_PATTERNS のいずれかにマッチするか判定
  const isSlideTarget = SLIDE_PATH_PATTERNS.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: '#F9F9F9',
      }}
    >
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
    </Box>
  );
}