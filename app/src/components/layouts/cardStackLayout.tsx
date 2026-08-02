import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

interface CardStackLayoutProps {
  children: React.ReactNode;
  addCardHandler: () => void;
}

function CardStackLayout({
  children,
  addCardHandler,
}: CardStackLayoutProps) {
  return (
    <Container
      maxWidth="md"
      sx={{
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Stack
        spacing={3}
        sx={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 4,
          px: 1,
          boxSizing: 'border-box',
        }}
      >
        {React.Children.map(children, (child, index) => (
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
                objectFit: 'cover',
              },
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
            minHeight: 48,
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
  );
}

export default CardStackLayout;