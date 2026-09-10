import { Component, type ErrorInfo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 将来 Sentry 等を導入する場合はここに送信処理を追加する（docs/error-monitoring.md参照）
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>予期しないエラーが発生しました</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            お手数ですが、画面を再読み込みしてください。解決しない場合は管理者にお問い合わせください。
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>再読み込み</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
