import Box from '@mui/material/Box'
import CircleIcon from '@mui/icons-material/Circle'

interface StatusIconProps {
  status: string;
}

function StatusIcon({ status }: StatusIconProps) {
  // status の値に応じて色を判定
  const getStatusColor = (st: string) => {
    switch (st) {
      case 'approved':
      case '承認済み':
        return 'limegreen';

      case 'pending':
      case '申請中':
        return 'orange'; // 申請中はオレンジ色

      case 'rejected':
      case '却下':
        return 'red';

      default:
        return 'gray';
    }
  };

  const color = getStatusColor(status);

  return (
    <Box sx={{ m: '10px', display: 'flex', alignItems: 'center' }}>
      <CircleIcon sx={{ width: '10px', height: '10px', color }} />
    </Box>
  );
}

export default StatusIcon;