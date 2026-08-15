import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface AdminUserItem {
  id: string;
  user_id: string;
  name: string;
  role: string;
}

interface UserContainerProps {
  data: AdminUserItem;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function UserContainer({ data, isSelected = false, onClick }: UserContainerProps) {
  if (!data) return null;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        cursor: 'pointer',
        bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        borderBottom: '1px solid #EEEEEE',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          bgcolor: isSelected ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.02)',
        },
      }}
    >
      {/* 1. 左側: ユーザーアイコン */}
      <Box
        sx={{
          mr: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isSelected ? 'primary.main' : '#333333',
        }}
      >
        <PersonOutlineIcon sx={{ fontSize: '32px' }} />
      </Box>

      {/* 2. 中央: ユーザーID (左) & 氏名 (右) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mr: 2,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            color: '#333333',
            fontFamily: 'monospace',
            flex: 1,
          }}
        >
          {data.user_id}
        </Typography>

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: isSelected ? 'bold' : 'normal',
            color: isSelected ? 'primary.main' : '#333333',
            flex: 1,
            textAlign: 'left',
          }}
        >
          {data.name || '名称未設定'}
        </Typography>
      </Box>

      {/* 3. 右端: 矢印アイコン */}
      <Box sx={{ display: 'flex', alignItems: 'center', color: isSelected ? 'primary.main' : '#CCCCCC' }}>
        <NavigateNextIcon sx={{ fontSize: '24px' }} />
      </Box>
    </Box>
  );
}