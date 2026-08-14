import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AdminAnalytics() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        支出合計
      </Typography>
    </Box>
  );
}

export default AdminAnalytics;