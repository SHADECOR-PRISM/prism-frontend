import { useState } from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DateRangeSelector, { type DateRange } from '../../../components/elements/dateRangeSelector';
import StatusPieChartCard from '../../../features/accounting/components/analytics/statusPieChartCard';
import ExpenseSummarySection from '../../../features/accounting/components/analytics/expenseSummarySection';
import { useAnalyticsSummary } from '../../../features/accounting/hooks/useAnalyticsSummary';

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: dayjs().subtract(1, 'month'),
    toDate: dayjs(),
  });

  const { data, loading, error } = useAnalyticsSummary(dateRange.fromDate, dateRange.toDate);

  const handleDateChange = (newRange: DateRange) => {
    setDateRange(newRange);
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
      {/* 1. 期間指定エリア（上部固定） */}
      <Box
        sx={{
          p: 2,
          flexShrink: 0,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Container maxWidth="xs" disableGutters sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <DateRangeSelector dateRange={dateRange} onChange={handleDateChange} />
        </Container>
      </Box>

      {/* 2. メインコンテンツ（中央スクロール領域） */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          py: 3,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            px: 2.5,
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}

          {loading && !data ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* 承認データ数ドーナツチャート */}
              <StatusPieChartCard data={data?.status_counts} />

              {/* 支出合計セクション */}
              <ExpenseSummarySection expenses={data?.expenses} />
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}