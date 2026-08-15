import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { type AdminUserItem } from '../../../components/elements/userContainer';
import UserContainerHeader from '../../../features/accounting/components/print/userContainerHeader';

interface LocationState {
  selectedUser?: AdminUserItem;
}

export default function PrintSettingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const selectedUser = state?.selectedUser;

  // フォームステート
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().subtract(1, 'month'));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [exportFormat, setExportFormat] = useState<string>('pdf');

  const isValidRange =
    !!fromDate &&
    !!toDate &&
    !fromDate.isAfter(toDate);

  // Step 3（伝票個別選択画面）へ進む
  const handleNext = () => {
    if (!selectedUser || !isValidRange) return;

    navigate('/admin/print/select', {
      state: {
        selectedUser,
        dateRange: {
          fromDate: fromDate?.toISOString(),
          toDate: toDate?.toISOString(),
        },
        exportFormat,
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {/* 1. ユーザーコンテナヘッダー */}
        <Box sx={{ width: '100%', flexShrink: 0 }}>
          <Container maxWidth="xs" disableGutters>
            <UserContainerHeader data={selectedUser} />
          </Container>
        </Box>

        {/* 2. プログレスバー (左右対称の余白で中央揃え) */}
        <Box sx={{ width: '100%', pt: 3, pb: 2, flexShrink: 0 }}>
          <Container maxWidth="xs" sx={{ px: 3 }}>
            <LinearProgress
              variant="determinate"
              value={1}
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

        {/* 3. 設定フォームエリア */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: 2 }}>
          <Container
            maxWidth="xs"
            sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            {/* 開始日 */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '15px', mb: 1, color: '#000000' }}>
                開始日
              </Typography>
              <MobileDatePicker
                format="YYYY/MM/DD"
                value={fromDate}
                onChange={(newVal) => setFromDate(newVal)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'medium',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#FFFFFF',
                      },
                    },
                  },
                }}
              />
            </Box>

            {/* 終了日 */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '15px', mb: 1, color: '#000000' }}>
                終了日
              </Typography>
              <MobileDatePicker
                format="YYYY/MM/DD"
                value={toDate}
                onChange={(newVal) => setToDate(newVal)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'medium',
                    error: !isValidRange,
                    helperText: !isValidRange ? '開始日より後の日付を指定してください' : undefined,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#FFFFFF',
                      },
                    },
                  },
                }}
              />
            </Box>

            {/* 出力形式プルダウン */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '15px', mb: 1, color: '#000000' }}>
                出力形式
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Container>
        </Box>

        {/* 4. フッターエリア (Next ボタン) */}
        <Box sx={{ pb: 3, pt: 1, flexShrink: 0 }}>
          <Container maxWidth="xs" sx={{ px: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              disabled={!isValidRange}
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
    </LocalizationProvider>
  );
}