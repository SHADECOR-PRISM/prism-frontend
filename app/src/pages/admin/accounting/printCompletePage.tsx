import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';

import apiClient from '../../../api/axiosInstance';
import { type AdminUserItem } from '../../../components/elements/userContainer';
import UserContainerHeader from '../../../features/accounting/components/print/userContainerHeader';
import { type LogItem } from '../../../features/accounting/components/container/logContainer';
import { type ContainerDetailData } from '../../../features/accounting/types/expenseTypes';
import { type ExpenseReportData } from '../../../features/accounting/types/reportTypes';
import { formatToReportData } from '../../../features/accounting/utils/reportDataFormatter';
import ExpenseReportPDF from '../../../features/accounting/components/print/expenseReportPDF';

interface LocationState {
  selectedUser?: AdminUserItem;
  dateRange?: {
    fromDate: string;
    toDate: string;
  };
  exportFormat?: string;
  selectedContainers?: LogItem[];
  remark?: string;
}

export default function PrintCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const selectedUser = state?.selectedUser;
  const dateRange = state?.dateRange;
  const remark = state?.remark || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ExpenseReportData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllDetails() {
      const containers = state?.selectedContainers || [];
      const containerIds = containers.map((c) => c.id);

      if (!selectedUser || containerIds.length === 0) {
        setLoading(false);
        setError('出力対象の申請データが見つかりません');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 複数コンテナの明細を一括取得（1回のリクエスト）
        const response = await apiClient.post<ContainerDetailData[]>(
          '/admin/containers/bulk-details',
          { container_ids: containerIds }
        );

        const detailedContainers = response.data;

        // PDF用の帳票データ構造へ整形
        const formatted = formatToReportData({
          applicant: {
            name: selectedUser.name || selectedUser.user_id || '申請者',
            userId: selectedUser.user_id || '',
          },
          period: {
            start: dayjs(dateRange?.fromDate || containers[0]?.applied_at),
            end: dayjs(dateRange?.toDate || containers[containers.length - 1]?.applied_at),
          },
          containers: detailedContainers,
          notes: remark || undefined,
        });

        if (isMounted) {
          setReportData(formatted);
        }
      } catch (err) {
        console.error('明細データ一括取得エラー:', err);
        if (isMounted) {
          setError('精算書データの生成に失敗しました');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchAllDetails();

    return () => {
      isMounted = false;
    };
  }, [state?.selectedContainers, selectedUser, dateRange?.fromDate, dateRange?.toDate, remark]);

  const handleReset = () => {
    navigate('/admin/print');
  };

  const fileName = reportData
    ? `精算書_${reportData.applicant.name}_${reportData.period.start.replace(/\//g, '')}-${reportData.period.end.replace(/\//g, '')}.pdf`
    : '精算書.pdf';

  return (
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

      {/* 2. プログレスバー (Step 5: 100%) */}
      <Box sx={{ width: '100%', pt: 3, pb: 2, flexShrink: 0 }}>
        <Container maxWidth="xs" sx={{ px: 3 }}>
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#EBEBEB',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: '#2E7D32',
              },
            }}
          />
        </Container>
      </Box>

      {/* 3. メインコンテンツ（中央） */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2.5,
          }}
        >
          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={44} />
              <Typography sx={{ fontSize: '14px', color: '#666666' }}>
                精算書データを生成中...
              </Typography>
            </Box>
          ) : reportData ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 72, color: '#2E7D32' }} />

              <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#000000', mb: 0.5 }}>
                  精算書の発行準備が完了しました
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                  対象件数: {reportData.transportation.items.length + reportData.expenses.items.length}件 / 合計: ¥{reportData.totalAmount.toLocaleString()} -
                </Typography>
              </Box>

              {/* PDFダウンロードリンクボタン */}
              <Box sx={{ width: '100%', pt: 2 }}>
                <PDFDownloadLink
                  document={<ExpenseReportPDF data={reportData} />}
                  fileName={fileName}
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  {({ loading: pdfLoading }) => (
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={pdfLoading}
                      startIcon={
                        pdfLoading ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <PictureAsPdfIcon />
                        )
                      }
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        bgcolor: '#000000',
                        color: '#FFFFFF',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#333333',
                        },
                      }}
                    >
                      {pdfLoading ? 'PDFファイル作成中...' : 'PDFをダウンロード'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </Box>
            </>
          ) : null}
        </Container>
      </Box>

      {/* 4. フッターエリア (Top / 完了 ボタン) */}
      <Box sx={{ pb: 3, pt: 1, flexShrink: 0 }}>
        <Container maxWidth="xs" sx={{ px: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: '#CCCCCC',
              color: '#444444',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#999999',
                bgcolor: '#F9F9F9',
              },
            }}
          >
            別の精算書を発行する
          </Button>
        </Container>
      </Box>
    </Box>
  );
}