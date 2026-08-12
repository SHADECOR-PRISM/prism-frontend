import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from 'react-router-dom';
import { type LogItem } from './logContainer';

interface ContainerHeaderProps {
  containerId: string;
  data?: LogItem; 
}

export default function ContainerHeader({ containerId, data }: ContainerHeaderProps) {
  const navigate = useNavigate();

  // 1. category から「経費」か「交通費」かを判定するロジック
  const isExpense = data?.category === '経費';
  const isTransport = data?.category === '交通費';

  // カテゴリバッジの配色・アイコン切り替え
  const categoryBgColor = isExpense ? '#E3F2FD' : isTransport ? '#FFF3E0' : '#EEEEEE';
  const categoryTextColor = isExpense ? '#1976D2' : isTransport ? '#E65100' : '#666666';

  // 2. 金額のフォーマット処理
  const formattedAmount = typeof data?.total_amount === 'number'
    ? data.total_amount.toLocaleString()
    : String(data?.total_amount ?? 0);

  // 3. ステータスに応じた Chip の設定
  const getStatusChip = (status?: string) => {
    switch (status) {
      case 'approved':
      case '承認済み':
        return <Chip label="承認済み" color="success" size="small" sx={{ height: 20, fontSize: '11px', fontWeight: 'bold' }} />;
      case 'rejected':
      case '却下':
        return <Chip label="却下" color="error" size="small" sx={{ height: 20, fontSize: '11px', fontWeight: 'bold' }} />;
      case 'pending':
      case '申請中':
      default:
        return <Chip label="申請中" color="warning" size="small" sx={{ height: 20, fontSize: '11px', fontWeight: 'bold' }} />;
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E0E0E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        zIndex: 10,
      }}
    >
      {/* 左側: 戻るボタン + タイトル & (カテゴリ / ステータス / 日付) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <IconButton onClick={() => navigate(-1)} edge="start" sx={{ color: '#000000' }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ minWidth: 0 }}>
          {/* 上段: プロジェクト名 + ステータスバッジ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {data?.project_name || '申請詳細'}
            </Typography>
            {getStatusChip(data?.status)}
          </Box>

          {/* 下段: カテゴリバッジ + 申請日またはID */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            {data?.category && (
              <Box
                sx={{
                  px: 0.8,
                  py: 0.1,
                  borderRadius: '4px',
                  bgcolor: categoryBgColor,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.3,
                }}
              >
                {isTransport && <DirectionsSubwayIcon sx={{ fontSize: '12px', color: categoryTextColor }} />}
                {isExpense && <ReceiptLongIcon sx={{ fontSize: '12px', color: categoryTextColor }} />}
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: categoryTextColor }}>
                  {data.category}
                </Typography>
              </Box>
            )}

            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
              {data?.applied_at ? `申請日: ${data.applied_at}` : `ID: ${containerId.slice(0, 8)}...`}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 右側: 合計金額 */}
      <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '10px' }}>
          合計金額
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '18px', lineHeight: 1 }}>
          ¥{formattedAmount}
        </Typography>
      </Box>
    </Box>
  );
}