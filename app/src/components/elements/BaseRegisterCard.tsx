import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';

interface BaseCardProps {
  children: React.ReactNode;
  actionArea?: React.ReactNode; 
}

function BaseRegisterCard({ children, actionArea }: BaseCardProps) {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        position: 'relative', 
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box',
        '&:last-child': { pb: 2 } 
      }}>
        
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          {children}
        </Box>

        {actionArea && (
          <Box sx={{ 
            position: 'absolute',
            bottom: 12, 
            right: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1 
          }}>
            {actionArea}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default BaseRegisterCard