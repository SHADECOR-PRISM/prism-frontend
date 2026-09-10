import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';

interface StatusIconProps {
  status: string;
}

export default function StatusIcon({ status }: StatusIconProps) {
  const getStatusColor = (st: string) => {
    switch (st?.toLowerCase()) {
      case 'approved':
      case '承認済み':
        return '#2e7d32'; // MUI color="success" (深みのある上品な緑)

      case 'rejected':
      case '却下':
        return '#d32f2f'; // MUI color="error" (視認性の高い赤)

      case 'pending':
      case '申請中':
      default:
        return '#9e9e9e'; // ニュートラルなグレー（視認性改善のためオレンジから変更）
    }
  };

  const color = getStatusColor(status);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircleIcon sx={{ width: '10px', height: '10px', color }} />
    </Box>
  );
}