import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { getFastAPI } from '../../../api/generated/prismApi';
import { type AdminUserItem } from '../../../components/elements/userContainer';
import UserContainerHeader from '../../../features/accounting/components/print/userContainerHeader';
import { type LogItem } from '../../../features/accounting/components/container/logContainer';
import { type ExpenseReportData } from '../../../features/accounting/types/reportTypes';
import { formatToReportData } from '../../../features/accounting/utils/reportDataFormatter';

// 個人用出力コンポーネント
import ExpenseReportPDF from '../../../features/accounting/components/print/expenseReportPDF';
import { exportExpenseReportExcel } from '../../../features/accounting/components/print/expenseReportExcel';

// 全体用出力コンポーネント（新規作成対象）
import OverallExpenseReportPDF from '../../../features/accounting/components/print/overallExpenseReportPDF';
import { exportOverallExpenseReportExcel } from '../../../features/accounting/components/print/overallExpenseReportExcel';

interface LocationState {
  mode?: 'personal' | 'overall';
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

  const mode: 'personal' | 'overall' = state?.mode || (state?.selectedUser ? 'personal' : 'overall');
  const isPersonal = mode === 'personal';
  const selectedUser = state?.selectedUser;
  const dateRange = state?.dateRange;
  const exportFormat = state?.exportFormat || 'pdf';
  const remark = state?.remark || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [isExportingExcel, setIsExportingExcel] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ExpenseReportData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllDetails() {
      const containers = state?.selectedContainers || [];
      const containerIds = containers.map((c) => String(c.id)).filter(Boolean);

      // 個人モード時は selectedUser が必須、全体モード時はコンテナ件数のみ検証
      if ((isPersonal && !selectedUser) || containerIds.length === 0) {
        setLoading(false);
        setError('出力対象の申請データが見つかりません');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 複数コンテナの明細を一括取得（1回のリクエスト）
        const detailedContainers = await getFastAPI().getAdminContainersBulkDetails({
          container_ids: containerIds,
        });

        // 申請者情報の表示名分岐
        const applicantName = isPersonal
          ? (selectedUser?.name || selectedUser?.user_id || '申請者')
          : '全体支出明細 (全メンバー)';

        const applicantUserId = isPersonal ? (selectedUser?.user_id || '') : 'ALL_MEMBERS';

        // PDF/Excel用の帳票データ構造へ整形
        const formatted = formatToReportData({
          applicant: {
            name: applicantName,
            userId: applicantUserId,
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
  }, [state?.selectedContainers, isPersonal, selectedUser, dateRange?.fromDate, dateRange?.toDate, remark]);

  // Excel ダウンロード処理（個人 / 全体で関数を切り替え）
  const handleDownloadExcel = async () => {
    if (!reportData) return;
    try {
      setIsExportingExcel(true);
      if (isPersonal) {
        await exportExpenseReportExcel(reportData);
      } else {
        await exportOverallExpenseReportExcel(reportData);
      }
    } catch (err) {
      console.error('Excel出力エラー:', err);
      setError('Excelファイルの出力に失敗しました');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleReset = () => {
    navigate('/admin/print');
  };

  // ファイル名設定（個人 / 全体）
  const periodStr = reportData
    ? `${reportData.period.start.replace(/\//g, '')}-${reportData.period.end.replace(/\//g, '')}`
    : '';

  const fileName = reportData
    ? isPersonal
      ? `精算書_${reportData.applicant.name}_${periodStr}.pdf`
      : `全体支出明細_${periodStr}.pdf`
    : '支出明細書.pdf';

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
            <UserContainerHeader data={selectedUser} onBack={() => navigate(-1)} />
          ) : (
            <Box
              sx={{
                py: 1.5,
                pl: 1,
                pr: 3,
                borderBottom: '1px solid #EBEBEB',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: '#000000' }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Container>
      </Box>

      {/* 2. プログレスバー (100% 完了) */}
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
                {isPersonal ? '精算書データを生成中...' : '全体支出明細データを生成中...'}
              </Typography>
            </Box>
          ) : reportData ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 72, color: '#2E7D32' }} />

              <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#000000', mb: 0.5 }}>
                  {isPersonal ? '精算書の発行準備が完了しました' : '全体明細の発行準備が完了しました'}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                  形式: {exportFormat.toUpperCase()} / 対象件数: {reportData.transportation.items.length + reportData.expenses.items.length}件 / 合計: ¥{reportData.totalAmount.toLocaleString()} -
                </Typography>
              </Box>

              {/* ダウンロードボタン */}
              <Box sx={{ width: '100%', pt: 2 }}>
                {exportFormat === 'xlsx' ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleDownloadExcel}
                    disabled={isExportingExcel}
                    startIcon={
                      isExportingExcel ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <TableViewIcon />
                      )
                    }
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: '#2E7D32',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#1B5E20',
                      },
                    }}
                  >
                    {isExportingExcel ? 'Excelファイル生成中...' : 'Excelをダウンロード'}
                  </Button>
                ) : (
                  <PDFDownloadLink
                    document={
                      isPersonal ? (
                        <ExpenseReportPDF data={reportData} />
                      ) : (
                        <OverallExpenseReportPDF data={reportData} />
                      )
                    }
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
                )}
              </Box>
            </>
          ) : null}
        </Container>
      </Box>

      {/* 4. フッターエリア (リセットボタン) */}
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
            別の明細書を発行する
          </Button>
        </Container>
      </Box>
    </Box>
  );
}