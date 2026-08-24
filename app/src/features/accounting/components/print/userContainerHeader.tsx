import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { type AdminUserItem } from '../../../../components/elements/userContainer';

interface UserContainerHeaderProps {
  data?: AdminUserItem | null;
}

export default function UserContainerHeader({ data }: UserContainerHeaderProps) {
  if (!data) return null;

  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #EEEEEE',
      }}
    >
      {/* 1. 左側: ユーザーアイコン */}
      <Box
        sx={{
          mr: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333333',
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
          minWidth: 0,
        }}
      >
        {/* ユーザーID */}
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

        {/* 登録名 */}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333333',
            flex: 1,
            textAlign: 'left',
          }}
        >
          {data.name || '名称未設定'}
        </Typography>
      </Box>
    </Box>
  );
}