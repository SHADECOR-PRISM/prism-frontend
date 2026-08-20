import { type ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import BaseRegisterCard from './baseRegisterCard';
import StatusIcon from '../container/statusIcon';

import { type TransportDetail, TRANSPORT_CATEGORY_LABELS } from '../../types/expenseTypes';

interface TransportRegisterCardProps {
  data: TransportDetail;
  actionArea: ReactNode;
}

function TransportRegisterCard({ data, actionArea }: TransportRegisterCardProps) {
  const displayCategory = TRANSPORT_CATEGORY_LABELS[data.category] ?? data.category;
  
  return (
    <BaseRegisterCard actionArea={actionArea}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        height: '100%',
        p: 0.5 
      }}>
        
        {/* 上部：メイン情報セクション */}
        <Stack spacing={0.5} sx={{ width: '100%', textAlign: 'left' }}>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            width: '100%' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {displayCategory}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({data.is_round_trip ? '往復' : '片道'})
              </Typography>
            </Box>
            
            <Box sx={{ ml: 'auto', display: 'flex' }}>
              <StatusIcon status={data.status} />
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {data.departure}駅 - {data.arrival}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.primary' }}>
            {data.amount.toLocaleString()}円
          </Typography>
        </Stack>

        {/* 下部：日付セクション */}
        <Box sx={{ 
          mt: 'auto', 
          textAlign: 'left',
          pr: '130px' // ✅ アクションボタン（Edit/Delete）との重なり防止を追加
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            {data.usage_date}
          </Typography>
        </Box>
      </Box>
    </BaseRegisterCard>
  );
}

export default TransportRegisterCard;
