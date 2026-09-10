import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getFastAPI } from '../../../api/generated/prismApi';
import type { AdminUserItem } from '../../../api/generated/prismApi.schemas';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DateRangeSelector, { type DateRange } from '../../../components/elements/dateRangeSelector.tsx';
import LogContainer, { type LogItem } from '../../../features/accounting/components/container/logContainer.tsx';

function AdminApproval() {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: dayjs().subtract(3, 'month'),
    toDate: dayjs(),
  });
  
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<AdminUserItem[]>([]);

  // 公開ユーザーコード（usr00001 等）→ 氏名 の変換マップ
  const userNameMap = useMemo(
    () => Object.fromEntries(users.map((user) => [user.user_id, user.name || user.user_id])),
    [users]
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const isValidRange =
    !!dateRange.fromDate &&
    !!dateRange.toDate &&
    !dateRange.fromDate.isAfter(dateRange.toDate);

  // コンテナクリック時：詳細画面へ遷移しデータ受け渡し
  const handleContainerClick = (item: LogItem) => {
    const targetId = item.id ?? 'dummy-container-uuid';
    navigate(`/admin/approval/${targetId}`, {
      state: { 
        containerData: item 
      },
    });
  };

  // 日付選択時のリセット処理
  const handleDateChange = (newRange: DateRange) => {
    const valid =
      !!newRange.fromDate &&
      !!newRange.toDate &&
      !newRange.fromDate.isAfter(newRange.toDate);

    setDateRange(newRange);
    setLogs([]);
    setHasMore(valid);
    isFetchingRef.current = false;
  };

  // ステータス選択時のリセット処理
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
    setLogs([]);
    setHasMore(isValidRange);
    isFetchingRef.current = false;
  };

  // ユーザー選択時のリセット処理
  const handleUserChange = (event: SelectChangeEvent) => {
    setUserId(event.target.value);
    setLogs([]);
    setHasMore(isValidRange);
    isFetchingRef.current = false;
  };

  // 絞り込み用ユーザー一覧の取得（マウント時に一度だけ）
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getFastAPI().getAdminUsers();
        setUsers(res || []);
      } catch (error) {
        console.error('ユーザー一覧取得エラー:', error);
      }
    };
    fetchUsers();
  }, []);

  // 全ユーザーログ取得 API 呼び出し
  const loadLogs = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || !isValidRange || !dateRange.fromDate || !dateRange.toDate) return;

    isFetchingRef.current = true;
    setLoading(true);

    const start = dateRange.fromDate.startOf('day').toISOString();
    const end = dateRange.toDate.add(1, 'day').startOf('day').toISOString();

    try {
      const currentOffset = logs.length;
      // 追加した /admin/container/all エンドポイントを呼び出し
      const response = await getFastAPI().getAdminContainerAll({
        start,
        end,
        offset: currentOffset,
        status: status || undefined,
        user_id: userId || undefined,
      });

      if (!response || response.length === 0) {
        setHasMore(false);
      } else {
        setLogs((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = response.filter((item) => !existingIds.has(item.id));

          // 新しい要素が実質増えなかった場合は上限到達とみなす
          if (uniqueNewItems.length === 0) {
            setHasMore(false);
            return prev;
          }
          return [...prev, ...uniqueNewItems];
        });
      }
    } catch (error) {
      console.error('全ユーザーログ取得エラー:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, isValidRange, dateRange, logs.length, status, userId]);

  // 無限スクロールの検知設定
  useEffect(() => {
    if (!hasMore || !isValidRange) return;

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
  }, [hasMore, isValidRange, loadLogs]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#F9F9F9',
      }}
    >
      {/* 1. 日付選択エリア（上部固定） */}
      <Box
        sx={{
          p: 2,
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <DateRangeSelector dateRange={dateRange} onChange={handleDateChange} />
        </Container>
      </Box>

      {/* 1.5. ステータス絞り込みエリア（日付選択エリアの下部） */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Select
            size="small"
            displayEmpty
            value={userId}
            onChange={handleUserChange}
            sx={{ minWidth: 140, bgcolor: '#FFFFFF' }}
          >
            <MenuItem value="">User</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name || user.user_id}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            displayEmpty
            value={status}
            onChange={handleStatusChange}
            sx={{ minWidth: 140, bgcolor: '#FFFFFF' }}
          >
            <MenuItem value="">Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </Container>
      </Box>

      {/* 2. ログリスト領域（中央スクロールエリア） */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', bgcolor: '#FFFFFF', px: 2, py: 1 }}>
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', flexDirection: 'column' }}>
          {logs.map((item, index) => (
            <LogContainer
              key={item.id ? `admin-log-${item.id}` : `admin-log-idx-${index}`}
              data={{ ...item, user_id: userNameMap[item.user_id] ?? item.user_id }}
              onClick={() => handleContainerClick(item)}
            />
          ))}

          {hasMore && <Box ref={loaderRef} sx={{ height: '20px', width: '100%' }} />}
        
          {!hasMore && logs.length === 0 && (
            <Typography sx={{ fontSize: '14px', color: 'grey', my: 4, textAlign: 'center' }}>
              {!isValidRange ? '正しい日付範囲を指定してください' : '申請データがありません'}
            </Typography>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size="24px" color="inherit" />
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default AdminApproval;