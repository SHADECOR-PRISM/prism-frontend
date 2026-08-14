import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface CategoryIconProps {
  category: string;
}

export default function CategoryIcon({ category }: CategoryIconProps) {
  // category の値に応じてテキスト、配色、アイコンを判定
  const getCategoryConfig = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case '経費':
      case 'expense':
        return {
          text: '経費',
          bgColor: '#E3F2FD',
          textColor: '#1976D2',
          icon: <ReceiptLongIcon sx={{ fontSize: '12px', color: '#1976D2' }} />,
        };

      case '交通費':
      case 'transportation':
        return {
          text: '交通費',
          bgColor: '#FFF3E0',
          textColor: '#E65100',
          icon: <DirectionsSubwayIcon sx={{ fontSize: '12px', color: '#E65100' }} />,
        };

      default:
        return {
          text: cat || '未設定',
          bgColor: '#EEEEEE',
          textColor: '#666666',
          icon: null,
        };
    }
  };

  const { text, bgColor, textColor, icon } = getCategoryConfig(category);

  return (
    <Box
      sx={{
        px: 0.8,
        py: 0.1,
        borderRadius: '4px',
        bgcolor: bgColor,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.3,
        flexShrink: 0,
      }}
    >
      {icon}
      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 'bold',
          color: textColor,
          lineHeight: 1.2,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}