import { useState, useRef, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import apiClient from '../../../api/axiosInstance.tsx'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import DateRangeSelector, { type DateRange } from '../../../components/elements/dateRangeSelector.tsx'
import LogContainer from '../../../features/accounting/components/container/logContainer.tsx'

export interface LogItem {
  id: string | number;
  status: string;
  project_name: string;
  applied_at: string;
  category: string;
  total_amount: number;
  user_id: string;
}

function GeneralLog() {
  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: dayjs().subtract(3, 'month'),
    toDate: dayjs(),
  });
  
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 日付範囲の妥当性チェック
  const isValidRange =
    !!dateRange.fromDate &&
    !!dateRange.toDate &&
    !dateRange.fromDate.isAfter(dateRange.toDate);

  // 日付変更時のハンドラーで直接ステートをリセット＆更新
  const handleDateChange = (newRange: DateRange) => {
    const valid =
      !!newRange.fromDate &&
      !!newRange.toDate &&
      !newRange.fromDate.isAfter(newRange.toDate);

    setDateRange(newRange);
    setLogs([]);
    setOffset(0);
    setLoading(false);
    setHasMore(valid);
  };

  // データ取得関数
  const loadLogs = useCallback(async () => {
    if (loading || !hasMore || !isValidRange || !dateRange.fromDate || !dateRange.toDate) return;

    setLoading(true);

    const start = dateRange.fromDate.startOf('day').toISOString();
    const end = dateRange.toDate.add(1, 'day').startOf('day').toISOString();

    try {
      const response = await apiClient.get<LogItem[]>(`/container/me?start=${start}&end=${end}&offset=${offset}`);

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setLogs((prev) => [...prev, ...response.data]);
        setOffset((prev) => prev + response.data.length);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, isValidRange, dateRange, offset]);

  // スクロール監視 (IntersectionObserver)
  useEffect(() => {
    if (!hasMore || !isValidRange) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
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
  }, [hasMore, isValidRange, loading, loadLogs]);

  return (
    <>
      <Container sx={{ position: 'sticky', top: '60px', zIndex: 10, py: '20px', display: 'flex', bgcolor: 'white' }}>
        <Box sx={{ flexGrow: 1 }} />
        <DateRangeSelector dateRange={dateRange} onChange={handleDateChange} />
      </Container>
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {logs.map((item) => (
          <LogContainer key={item.id} logData={item} />
        ))}
        {hasMore && <Box ref={loaderRef} sx={{ height: '20px', width: '100%' }} />}
        {!hasMore && logs.length === 0 && (
          <Typography sx={{ fontSize: '16px', color: 'grey', my: 4 }}>
            {!isValidRange ? '正しい日付範囲を指定してください' : 'No items'}
          </Typography>
        )}
        {loading && <CircularProgress size="30px" color="inherit" aria-label="Loading…" sx={{ my: 2 }} />}
      </Container>
    </>
  );
}

export default GeneralLog;