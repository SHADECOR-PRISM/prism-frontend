import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function DynamicGridLayout({ children }: { children: React.ReactNode[] }) {
  const count = children.length;

  // 0つの場合：メッセージ表示
  if (count === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p>表示する要素がありません</p>
      </Container>
    );
  }

  const getLayoutStyles = () => {
    // 1つの場合：上下左右中央
    if (count === 1) {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    }

    // 2つの場合：上下に2分割
    if (count === 2) {
      return {
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gap: 2,
      };
    }

    // 3個以上：2列のグリッド
    return {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
    };
  };

  return (
    <Container
      sx={{
        width: '100%',
        height: '100%', 
        p: 2,
        overflow: 'auto',
        ...getLayoutStyles(),
      }}
    >
      {children.map((child, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            aspectRatio: '1/1',
            '& > *': {
              borderRadius: '5%',
              width: '100%',   
              height: '100%',   
            }
          }}
        >
          {child}
        </Box>
      ))}
    </Container>
  );
};

export default DynamicGridLayout;


