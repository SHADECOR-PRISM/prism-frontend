import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { getFastAPI } from '../../../api/generated/prismApi';
import { type AdminUserItem } from '../../../components/elements/userContainer';
import UserContainerHeader from '../../../features/accounting/components/print/userContainerHeader';
import LogContainer, { type LogItem } from '../../../features/accounting/components/container/logContainer';

interface LocationState {
  mode?: 'personal' | 'overall';
  selectedUser?: AdminUserItem;
  dateRange?: {
    fromDate: string;
    toDate: string;
  };
  exportFormat?: string;
}

export default function PrintCheckApprovalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const mode: 'personal' | 'overall' = state?.mode || (state?.selectedUser ? 'personal' : 'overall');
  const isPersonal = mode === 'personal';
  const selectedUser = state?.selectedUser;
  const dateRange = state?.dateRange;
  const exportFormat = state?.exportFormat || 'pdf';

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1回のリクエストで期間内の全件を一括取得（limit=1000）
  useEffect(() => {
    let isMounted = true;

    async function fetchAllLogs() {
      if (!dateRange?.fromDate || !dateRange?.toDate) {
        setLoading(false);
        return;
      }
      if (isPersonal && !selectedUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const start = dayjs(dateRange.fromDate).startOf('day').toISOString();
      const end = dayjs(dateRange.toDate).add(1, 'day').startOf('day').toISOString();

      try {
        // limit=1000, offset=0 を指定して1発取得
        const response = isPersonal
          ? await getFastAPI().getAdminContainerByUser(selectedUser!.id, { start, end, offset: 0, limit: 1000 })
          : await getFastAPI().getAdminContainerAll({ start, end, offset: 0, limit: 1000 });

        if (isMounted) {
          setLogs(response || []);
        }
      } catch (err) {
        console.error('伝票ログ一括取得エラー:', err);
        if (isMounted) {
          setError('伝票一覧の取得に失敗しました');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchAllLogs();

    return () => {
      isMounted = false;
    };
  }, [isPersonal, selectedUser, dateRange?.fromDate, dateRange?.toDate]);

  // コンテナクリック時：承認詳細画面へ遷移
  const handleContainerClick = (item: LogItem) => {
    const targetId = item.id;
    if (!targetId) return;

    navigate(`/admin/approval/${targetId}`, {
      state: { containerData: item },
    });
  };

  // 承認済み伝票のみを抽出
  const approvedLogs = useMemo(() => {
    return logs.filter((item) => {
      const s = (item.status || '').toLowerCase();
      return s === 'approved' || s === 'approval';
    });
  }, [logs]);

  // 未承認伝票の存在チェック
  const hasUnapproved = logs.length > approvedLogs.length;

  // Nextボタンの活性条件: 読み込み中以外、エラーなし、承認済み伝票が1件以上あること
  const isNextDisabled = loading || !!error || approvedLogs.length === 0;

  // Step 3（備考入力画面）へ進む（承認済みデータのみを引き継ぐ）
  const handleNext = () => {
    if (isNextDisabled) return;

    navigate('/admin/print/remark', {
      state: {
        mode,
        selectedUser,
        dateRange,
        exportFormat,
        selectedContainers: approvedLogs, // ★ 承認済み伝票（全件）を渡す
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

      {/* 2. プログレスバー (個人: 5段階のStep3=60%, 全体: 4段階のStep2=50%) */}
      <Box sx={{ width: '100%', pt: 3, pb: 2, flexShrink: 0 }}>
        <Container maxWidth="xs" sx={{ px: 3 }}>
          <LinearProgress
            variant="determinate"
            value={isPersonal ? 60 : 50}
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

      {/* エラー / ステータス案内メッセージ */}
      <Box sx={{ px: 3, pb: 1, flexShrink: 0 }}>
        <Container maxWidth="xs" disableGutters>
          {error && (
            <Alert severity="error" sx={{ fontSize: '12px', py: 0.5 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && logs.length > 0 && (
            hasUnapproved ? (
              <Alert severity="info" sx={{ fontSize: '12px', py: 0.5 }}>
                未承認の申請が含まれています。出力時は承認済みの伝票（{approvedLogs.length}件）のみが対象となります。
              </Alert>
            ) : (
              <Alert severity="success" sx={{ fontSize: '12px', py: 0.5 }}>
                すべての申請（{approvedLogs.length}件）が承認済みです。
              </Alert>
            )
          )}
        </Container>
      </Box>

      {/* 3. 伝票一覧リスト領域 */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarGutter: 'stable',
          bgcolor: '#FFFFFF',
          py: 1,
        }}
      >
        <Container
          maxWidth="xs"
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box',
            px: 1,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 6, gap: 1.5 }}>
              <CircularProgress size={32} />
              <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                対象期間の伝票データを読み込み中...
              </Typography>
            </Box>
          ) : logs.length === 0 ? (
            <Typography sx={{ fontSize: '14px', color: 'grey', my: 6, textAlign: 'center' }}>
              対象期間内の申請データがありません
            </Typography>
          ) : (
            logs.map((item, index) => (
              <Box
                key={item.id ? `select-log-${item.id}` : `select-log-idx-${index}`}
                sx={{ width: '100%', boxSizing: 'border-box' }}
              >
                <LogContainer
                  data={item}
                  onClick={() => handleContainerClick(item)}
                />
              </Box>
            ))
          )}
        </Container>
      </Box>

      {/* 4. フッターエリア (Next ボタン) */}
      <Box sx={{ pb: 3, pt: 1, flexShrink: 0 }}>
        <Container maxWidth="xs" sx={{ px: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleNext}
            disabled={isNextDisabled}
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
            {approvedLogs.length > 0 ? `Next (${approvedLogs.length}件出力)` : 'Next'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}