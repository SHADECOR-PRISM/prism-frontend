import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        backgroundColor: '#F9F9F9',
      }}
    >
      {/* 上部ヘッダー（戻るボタン） */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <IconButton onClick={() => navigate(-1)} edge="start" sx={{ mr: 1, color: '#000000' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          申請詳細（仮）
        </Typography>
      </Box>

      {/* 仮のコンテンツ表示領域 */}
      <Container maxWidth="md" sx={{ py: 3, flex: 1, overflowY: 'auto' }}>
        <Box sx={{ p: 3, backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E0E0E0', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            受け取った UUID (ID):
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'primary.main', mb: 2 }}>
            {id || 'IDが指定されていません'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            🎉 画面スライドアニメーションのテストページです。
            ここを CardStackLayout と明細データ表示に置き換えていきます。
          </Typography>
        </Box>

        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>
          一覧（Log）へ戻る
        </Button>
      </Container>
    </Box>
  );
}