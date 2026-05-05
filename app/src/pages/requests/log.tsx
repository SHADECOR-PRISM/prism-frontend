import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import apiClient from '../../api/axiosInstance'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LogContainer from '../../components/layouts/logContainer.tsx'

const LIMIT = 30;

function GeneralLog() {
  const [logs, setLogs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // データ取得
  const loadLogs = async () => {

    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await apiClient.get("/loadLogs", {
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
      <Container>
        {/* 表示期間指定 */}
      </Container>
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {logs.map((item) => (
          <LogContainer key={item.id} logData={item} />
        ))}
        {hasMore && <Box ref={loaderRef} />}
        {loading && <CircularProgress size="30px" color="inherit" aria-label="Loading…" />}
      </Container>
    </>
  )
}

export default GeneralLog
