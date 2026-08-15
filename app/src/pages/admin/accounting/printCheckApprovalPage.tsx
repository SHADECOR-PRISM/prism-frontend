import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import apiClient from '../../../api/axiosInstance';
import { type AdminUserItem } from '../../../components/elements/userContainer';
import UserContainerHeader from '../../../features/accounting/components/print/userContainerHeader';
import LogContainer, { type LogItem } from '../../../features/accounting/components/container/logContainer';

interface LocationState {
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

  const selectedUser = state?.selectedUser;
  const dateRange = state?.dateRange;
  const exportFormat = state?.exportFormat || 'pdf';

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  // 対象ユーザーのログ取得 API
  const loadLogs = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || !selectedUser || !dateRange?.fromDate || !dateRange?.toDate) return;

    isFetchingRef.current = true;
    setLoading(true);

    const start = dayjs(dateRange.fromDate).startOf('day').toISOString();
    const end = dayjs(dateRange.toDate).add(1, 'day').startOf('day').toISOString();

    try {
      const currentOffset = logs.length;
      const response = await apiClient.get<LogItem[]>(
        `/admin/container/user/${selectedUser.id}?start=${start}&end=${end}&offset=${currentOffset}`
      );

      if (!response.data || response.data.length === 0) {
        setHasMore(false);
      } else {
        setLogs((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = response.data.filter((item) => !existingIds.has(item.id));

          if (uniqueNewItems.length === 0) {
            setHasMore(false);
            return prev;
          }
          return [...prev, ...uniqueNewItems];
        });
      }
    } catch (error) {
      console.error('伝票ログ取得エラー:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, selectedUser, dateRange, logs.length]);

  // 無限スクロールの検知
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingRef.current) {
        loadLogs();
      }
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [hasMore, loadLogs]);

  // コンテナクリック時：詳細画面へ遷移しデータ受け渡し
  const handleContainerClick = (item: LogItem) => {
    const targetId = item.id;
    if (!targetId) return;

    navigate(`/admin/approval/${targetId}`, {
      state: { containerData: item },
    });
  };

  // ★ 全ての伝票が承認済みかどうかを判定
  // （※DBのステータス値に合わせて 'approved' または 'approval' を判定）
  const isAllApproved = useMemo(() => {
    if (logs.length === 0) return false;
    return logs.every((item) => {
      const s = (item.status || '').toLowerCase();
      return s === 'approved' || s === 'approval';
    });
  }, [logs]);

  // Nextボタンの活性条件: 読み込み中以外、全データ読み込み完了、全件承認済み
  const isNextDisabled = loading || hasMore || !isAllApproved;

  // Step 4（プレビュー確認）へ進む
  const handleNext = () => {
    if (isNextDisabled) return;

    navigate('/admin/print/remark', {
      state: {
        selectedUser,
        dateRange,
        exportFormat,
        selectedContainers: logs,
      },
    });
  };

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

      {/* 2. プログレスバー (Step 3: 50%) */}
      <Box sx={{ width: '100%', pt: 3, pb: 2, flexShrink: 0 }}>
        <Container maxWidth="xs" sx={{ px: 3 }}>
          <LinearProgress
            variant="determinate"
            value={50}
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

      {/* 未承認伝票が存在する場合の警告メッセージ */}
      {!loading && !hasMore && logs.length > 0 && !isAllApproved && (
        <Box sx={{ px: 3, pb: 1, flexShrink: 0 }}>
          <Container maxWidth="xs" disableGutters>
            <Alert severity="warning" sx={{ fontSize: '12px', py: 0.5 }}>
              未承認の申請が含まれています。すべての申請が承認されるまで出力へ進めません。
            </Alert>
          </Container>
        </Box>
      )}

      {/* 3. 伝票一覧リスト領域（中央スクロールエリア） */}
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
          {logs.map((item, index) => (
            <Box key={item.id ? `select-log-${item.id}` : `select-log-idx-${index}`} sx={{ width: '100%', boxSizing: 'border-box' }}>
              <LogContainer
                data={item}
                onClick={() => handleContainerClick(item)}
              />
            </Box>
          ))}

          {hasMore && <Box ref={loaderRef} sx={{ height: '20px', width: '100%' }} />}

          {!hasMore && logs.length === 0 && (
            <Typography sx={{ fontSize: '14px', color: 'grey', my: 6, textAlign: 'center' }}>
              対象期間内の申請データがありません
            </Typography>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size="24px" color="inherit" />
            </Box>
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
            Next
          </Button>
        </Container>
      </Box>
    </Box>
  );
}