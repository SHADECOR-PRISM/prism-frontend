import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getFastAPI } from '../../../api/generated/prismApi';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DateRangeSelector, { type DateRange } from '../../../components/elements/dateRangeSelector.tsx';
import LogContainer, { type LogItem } from '../../../features/accounting/components/container/logContainer.tsx';

function GeneralLog() {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: dayjs().subtract(3, 'month'),
    toDate: dayjs(),
  });
  
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [hasRejected, setHasRejected] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const isValidRange =
    !!dateRange.fromDate &&
    !!dateRange.toDate &&
    !dateRange.fromDate.isAfter(dateRange.toDate);

  // ★ 修正箇所: LogItem 全体を受け取り、state 経由で遷移先へ渡す
  const handleContainerClick = (item: LogItem) => {
    const targetId = item.id ?? 'dummy-container-uuid';
    navigate(`/general/log/${targetId}`, {
      state: {
        containerData: item, // 詳細画面へデータを渡す
      },
    });
  };

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

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
    setLogs([]);
    setHasMore(isValidRange);
    isFetchingRef.current = false;
  };

  const loadLogs = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || !isValidRange || !dateRange.fromDate || !dateRange.toDate) return;

    isFetchingRef.current = true;
    setLoading(true);

    const start = dateRange.fromDate.startOf('day').toISOString();
    const end = dateRange.toDate.add(1, 'day').startOf('day').toISOString();

    try {
      const currentOffset = logs.length;
      const response = await getFastAPI().getContainerMe({
        start,
        end,
        offset: currentOffset,
        status: status || undefined,
      });

      if (!response || response.length === 0) {
        setHasMore(false);
      } else {
        setLogs((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = response.filter((item) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
      }
    } catch (error) {
      console.error('ログ取得エラー:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, isValidRange, dateRange, logs.length, status]);

  // 表示用のログインユーザー名を取得（マウント時に一度だけ）
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getFastAPI().getMe();
        setUserName(profile?.user_name || '');
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
      }
    };
    fetchProfile();
  }, []);

  // 差し戻し(rejected)の有無を確認（日付フィルタとは独立、全期間対象、マウント時に一度だけ）
  useEffect(() => {
    const checkRejected = async () => {
      try {
        const rejectedItems = await getFastAPI().getContainerMe({
          start: dayjs('2000-01-01').toISOString(),
          end: dayjs().add(1, 'day').startOf('day').toISOString(),
          offset: 0,
          status: 'rejected',
        });
        setHasRejected(!!rejectedItems && rejectedItems.length > 0);
      } catch (error) {
        console.error('差し戻し確認エラー:', error);
      }
    };
    checkRejected();
  }, []);

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
          px: 2,
          pt: 2,
          pb: 1,
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
          pb: 1,
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'flex-end',  
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
      
        {/* 1.6. 差し戻し警告（1件でもrejectedがあれば表示） */}
        {hasRejected && (
          <Typography
            sx={{ fontSize: '12px', color: 'error.main', px: 0, pb: 0, flexShrink: 0, textAlign: 'right', backgroundColor: '#FFFFFF' }}
          >
            差し戻された申請があります
          </Typography>
        )}

      </Box>

      {/* 2. ログリスト領域（中央スクロールエリア） */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', bgcolor: '#FFFFFF', px: 2, py: 1 }}>
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', flexDirection: 'column' }}>
          {logs.map((item, index) => (
            <LogContainer
              key={item.id ? `${item.id}-${index}` : index}
              data={{ ...item, user_id: userName || item.user_id }}
              onClick={() => handleContainerClick(item)} // ★ 修正箇所: item オブジェクトを渡す
            />
          ))}

          {hasMore && <Box ref={loaderRef} sx={{ height: '20px', width: '100%' }} />}
        
          {!hasMore && logs.length === 0 && (
            <Typography sx={{ fontSize: '14px', color: 'grey', my: 4, textAlign: 'center' }}>
              {!isValidRange ? '正しい日付範囲を指定してください' : 'No items'}
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

export default GeneralLog;