import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

function CardStackLayout({ children, addCardHandler }: { children: React.ReactNode[], addCardHandler: () => void }) {
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100%', 
        overflow: 'hidden', 
        display: 'flex', 
        justifyContent: 'center' 
      }}
    >
      <Stack
        spacing={3} 
        sx={{
          width: '100%', 
          alignItems: 'center', 
          overflowY: 'auto',  
          overflowX: 'hidden', 
          py: 4,
          px: 1,               
          boxSizing: 'border-box' 
        }}
      >
        {children.map((child, index) => (
          <Box
            key={index}
            sx={{
              width: '100%',
              maxWidth: '100%',
              flexShrink: 0,
              aspectRatio: '2.1 / 1', 
              boxSizing: 'border-box',
              display: 'flex', 
              '& > *': {
                borderRadius: '8px',
                width: '100%',   
                height: '100%', 
                objectFit: 'cover' 
              }
            }}
          >
            {child}
          </Box>
        ))}

        <Button 
          variant="outlined" 
          fullWidth
          onClick={addCardHandler}
          sx={{ 
            minHeight: '30px', 
            flexShrink: 0,   
            borderRadius: '8px',
            borderStyle: 'dashed',
            borderWidth: '2px',
          }}
        >
          <ControlPointIcon />
        </Button>
      </Stack>
    </Container>
  )
}

export default CardStackLayout