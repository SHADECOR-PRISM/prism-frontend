import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import Header from './header'
import Footer from './footer'

function HomeWithFooter() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default HomeWithFooter