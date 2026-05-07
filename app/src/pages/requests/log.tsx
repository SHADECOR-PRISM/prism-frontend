import { useState, useRef, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import apiClient from '../../api/axiosInstance'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import DateRangeSelector from '../../components/elements/dateRangeSelector.tsx'
import LogContainer from '../../components/layouts/logContainer.tsx'

const LIMIT = 10; //一度に読み込む数の制限

function GeneralLog() {
  const [dateRange, setDateRange] = useState({
    fromDate: dayjs().subtract(3, "month"),
    toDate: dayjs()
  });
  const [logs, setLogs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // 期間が変わるたびにリセット
  useEffect(() => {
    setLogs([]);
    setOffset(0);
    setLoading(false);
    setHasMore(!dateRange.fromDate.isAfter(dateRange.toDate));
  }, [dateRange]);

  // データ取得
  const loadLogs = async () => {

    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await apiClient.get("/loadLogs", {
        dateRange: dateRange,
        offset: offset,
        limit: LIMIT
      });
      
      setItems((prev) => [...prev, ...response.data]);

      if (response.data.length < LIMIT) {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
    finally {
      setLoading(false);
    }
  };

  // offsetが変わるたびに取得
  useEffect(() => {
    loadLogs();
  }, [offset]);

  // スクロール監視
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setOffset((prev) => prev + LIMIT);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      <Container sx={{ position: "sticky", top: "60px", zIndex: 10, py: "20px", display: "flex", bgcolor: "white" }}>
        <Box sx={{ flexGrow: 1 }} />
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </Container>
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {logs.map((item) => (
          <LogContainer key={item.id} logData={item} />
        ))}
        {hasMore && <Box ref={loaderRef} />}
        {!hasMore && logs.length == 0 && <Typography sx={{ fontSize: "16px", color: "grey" }}>No items</Typography>}
        {loading && <CircularProgress size="30px" color="grey" aria-label="Loading…" />}
      </Container>
    </>
  )
}

export default GeneralLog
