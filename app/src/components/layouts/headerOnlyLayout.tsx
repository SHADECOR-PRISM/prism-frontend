import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Outlet, useNavigate } from 'react-router-dom'

export default function HeaderOnlyLayout() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          height: 60,
          minHeight: '60px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#000000' }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

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
    </Box>
  )
}