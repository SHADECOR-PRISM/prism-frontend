import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import { type AdminUserItem } from '../../../components/elements/userContainer';
import UserContainerHeader from '../../../features/accounting/components/print/userContainerHeader';
import { type LogItem } from '../../../features/accounting/components/container/logContainer';

const MAX_REMARK_LENGTH = 800;

interface LocationState {
  mode?: 'personal' | 'overall';
  selectedUser?: AdminUserItem;
  dateRange?: {
    fromDate: string;
    toDate: string;
  };
  exportFormat?: string;
  selectedContainers?: LogItem[];
}

export default function PrintRemarkPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const mode: 'personal' | 'overall' = state?.mode || (state?.selectedUser ? 'personal' : 'overall');
  const isPersonal = mode === 'personal';
  const selectedUser = state?.selectedUser;
  const dateRange = state?.dateRange;
  const exportFormat = state?.exportFormat || 'pdf';
  const selectedContainers = state?.selectedContainers || [];

  const [remark, setRemark] = useState<string>('');

  const isOverLimit = remark.length > MAX_REMARK_LENGTH;

  // 最終完了・出力画面（PrintCompletePage）へ進む
  const handleNext = () => {
    if (isOverLimit) return;

    navigate('/admin/print/complete', {
      state: {
        mode,
        selectedUser,
        dateRange,
        exportFormat,
        selectedContainers,
        remark: remark.trim(),
      },
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* 1. 最上部ヘッダー（個人: ユーザー情報 / 全体: タイトルバー） */}
      <Box sx={{ width: '100%', flexShrink: 0 }}>
        <Container maxWidth="xs" disableGutters>
          {isPersonal ? (
            <UserContainerHeader data={selectedUser} />
          ) : (
            <Box
              sx={{
                py: 2,
                px: 3,
                borderBottom: '1px solid #EBEBEB',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#000000' }}>
                全体支出明細出力
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* 2. プログレスバー (個人: 5段階中Step4=80%, 全体: 4段階中Step3=75%) */}
      <Box sx={{ width: '100%', pt: 3, pb: 2, flexShrink: 0 }}>
        <Container maxWidth="xs" sx={{ px: 3 }}>
          <LinearProgress
            variant="determinate"
            value={isPersonal ? 80 : 75}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#EBEBEB',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: '#1976d2',
              },
            }}
          />
        </Container>
      </Box>

      {/* 3. 備考入力エリア（中央） */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: 2 }}>
        <Container
          maxWidth="xs"
          sx={{
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '15px', color: '#000000' }}>
              備考
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: isOverLimit ? 'error.main' : '#888888',
                fontWeight: isOverLimit ? 'bold' : 'normal',
              }}
            >
              {remark.length} / {MAX_REMARK_LENGTH}文字
            </Typography>
          </Box>

          <TextField
            multiline
            rows={8}
            fullWidth
            placeholder="明細書に記載する特記事項や補足事項があれば入力してください（任意）"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            error={isOverLimit}
            helperText={isOverLimit ? `最大文字数（${MAX_REMARK_LENGTH}文字）を超えています` : undefined}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              },
            }}
          />
        </Container>
      </Box>

      {/* 4. フッターエリア (Next ボタン) */}
      <Box sx={{ pb: 3, pt: 1, flexShrink: 0 }}>
        <Container maxWidth="xs" sx={{ px: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleNext}
            disabled={isOverLimit}
            sx={{
              py: 1.5,
              borderRadius: 2,
              bgcolor: '#000000',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#333333',
              },
              '&.Mui-disabled': {
                bgcolor: '#CCCCCC',
                color: '#888888',
              },
            }}
          >
            Next
          </Button>
        </Container>
      </Box>
    </Box>
  );
}