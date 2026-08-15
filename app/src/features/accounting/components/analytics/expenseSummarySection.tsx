import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface ExpenseData {
  transport: number;
  general: number;
  total: number;
}

interface ExpenseSummarySectionProps {
  expenses?: ExpenseData;
}

export default function ExpenseSummarySection({
  expenses = {
    transport: 0,
    general: 0,
    total: 0,
  },
}: ExpenseSummarySectionProps) {
  const total = expenses?.total ?? 0;
  const transport = expenses?.transport ?? 0;
  const general = expenses?.general ?? 0;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, px: 1 }}>
      {/* 見出し */}
      <Typography
        variant="h5"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#000000',
          letterSpacing: '0.05em',
        }}
      >
        支出合計
      </Typography>

      {/* 合計額 */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontSize: '12px', color: '#444444', fontWeight: 'bold', mb: 0.5 }}>
          合計額
        </Typography>
        <Typography
          sx={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '0.02em',
          }}
        >
          ¥ {total.toLocaleString()} -
        </Typography>
      </Box>

      {/* 内訳（交通費 / 経費 2カラム） */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        {/* 交通費 */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '12px', color: '#444444', fontWeight: 'bold', mb: 0.5 }}>
            交通費
          </Typography>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '0.02em',
            }}
          >
            ¥ {transport.toLocaleString()} -
          </Typography>
        </Box>

        {/* 経費 */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '12px', color: '#444444', fontWeight: 'bold', mb: 0.5 }}>
            経費
          </Typography>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '0.02em',
            }}
          >
            ¥ {general.toLocaleString()} -
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}