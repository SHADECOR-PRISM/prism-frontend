import { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface LogItem {
  id: string | number;
  status: string;
  project_name: string;
  applied_at: string;
  category: string;
  total_amount: number;
  user_id: string;
}

interface LogContainerProps {
  data: LogItem;
  actionArea?: ReactNode;
  onClick?: () => void;
}

export default function LogContainer({ data, actionArea, onClick }: LogContainerProps) {
  if (!data) return null;

  const amount = typeof data.total_amount === 'number'
    ? data.total_amount.toLocaleString()
    : String(data.total_amount ?? 0);

  // カテゴリごとのバッジ色設定
  const isExpense = data.category === '経費';
  const categoryBgColor = isExpense ? '#90CAF9' : '#FFCC80'; // 青系 vs オレンジ系
  const categoryTextColor = isExpense ? '#0D47A1' : '#E65100';

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 1,
        cursor: 'pointer',
        bgcolor: 'transparent',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.02)',
        },
      }}
    >
      {/* 1. 左端のステータスドット */}
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: '#FF5252', // 赤いドット
          mr: 1.5,
          flexShrink: 0,
        }}
      />

      {/* 2. 中央の主要テキストエリア */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* 上段: プロジェクト名 + 日付 */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#000000',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.project_name || '名称未設定'}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#888888', flexShrink: 0 }}>
            {data.applied_at || ''}
          </Typography>
        </Box>

        {/* 下段: カテゴリバッジ + 合計金額 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Box
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: '4px',
              bgcolor: categoryBgColor,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: categoryTextColor }}>
              {data.category || '未設定'}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '13px', color: '#666666' }}>
            合計: {amount}円
          </Typography>
        </Box>
      </Box>

      {/* 3. 右側: ユーザーID ＆ 矢印（またはアクションエリア） */}
      {actionArea ? (
        <Box sx={{ ml: 1, flexShrink: 0 }}>{actionArea}</Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, flexShrink: 0 }}>
          <Typography sx={{ fontSize: '12px', color: '#666666' }}>
            {data.user_id || ''}
          </Typography>
          <NavigateNextIcon sx={{ color: '#CCCCCC', fontSize: '20px' }} />
        </Box>
      )}
    </Box>
  );
}