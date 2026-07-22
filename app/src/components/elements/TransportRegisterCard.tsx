import React from 'react';
import BaseRegisterCard from './BaseRegisterCard';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import UnpublishedIcon from '@mui/icons-material/Unpublished';

interface TransportData {
  usage_date: string;
  category: string;
  departure: string;
  arrival: string;
  is_round_trip: boolean;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

function TransportRegisterCard({ data, actionArea }: { data: TransportData, actionArea: React.ReactNode }) {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'approved':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />;
      case 'rejected':
        return <UnpublishedIcon sx={{ color: 'error.main', fontSize: 20 }} />;
      case 'pending':
      default:
        return <PendingIcon sx={{ color: 'warning.main', fontSize: 20 }} />;
    }
  };
  
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
                {data.category}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({data.is_round_trip ? '往復' : '片道'})
              </Typography>
            </Box>
            
            <Box sx={{ ml: 'auto', display: 'flex' }}>
              {getStatusIcon()}
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
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            {data.usage_date}
          </Typography>
        </Box>
      </Box>
    </BaseRegisterCard>
  );
}

export default TransportRegisterCard