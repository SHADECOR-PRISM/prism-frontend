import { type ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import BaseRegisterCard from './baseRegisterCard';
import StatusIcon from '../container/statusIcon';

import { type GeneralExpenseDetail, EXPENSE_CATEGORY_LABELS } from '../../types/expenseTypes';

interface GeneralExpenseRegisterCardProps {
  data: GeneralExpenseDetail;
  actionArea: ReactNode;
}

function GeneralExpenseRegisterCard({ data, actionArea }: GeneralExpenseRegisterCardProps) {
  const displayCategory = EXPENSE_CATEGORY_LABELS[data.category] ?? data.category;

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
                {displayCategory} {/* 消耗品、交際費など */}
              </Typography>
            </Box>
            
            <Box sx={{ ml: 'auto', display: 'flex' }}>
              <StatusIcon status={data.status} />
            </Box>
          </Box>

          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500,
              display: '-webkit-box',
              WebkitLineClamp: 1, 
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {data.description} 
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.primary' }}>
            {data.amount.toLocaleString()}円
          </Typography>
        </Stack>

        {/* 下部：日付セクション */}
        <Box sx={{ 
          mt: 'auto', 
          textAlign: 'left',
          pr: '130px' // アクションボタン（Edit/Delete）との重なり防止
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            {data.usage_date}
          </Typography>
        </Box>
      </Box>
    </BaseRegisterCard>
  );
}

export default GeneralExpenseRegisterCard;