import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getFastAPI } from '../../../api/generated/prismApi';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
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
  }, [hasMore, isValidRange, dateRange, logs.length]);

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
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <DateRangeSelector dateRange={dateRange} onChange={handleDateChange} />
        </Container>
      </Box>

      {/* 2. ログリスト領域（中央スクロールエリア） */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', bgcolor: '#FFFFFF', px: 2, py: 1 }}>
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', flexDirection: 'column' }}>
          {logs.map((item, index) => (
            <LogContainer
              key={item.id ? `${item.id}-${index}` : index}
              data={item}
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