import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from '../../assets/hero.png'
import apiClient from '../../api/axiosInstance'

function Header() {
  const [currentDate, setCurrentDate] = useState('----/--/--')
  const [userName, setUserName] = useState('----')

  useEffect(() => {
    ;(async () => {
      try {
        const response = await apiClient.get('/users/me')
        setCurrentDate(response.data.current_date)
        setUserName(response.data.user_name)
      } catch {
        console.error('Unable to load user information')
      }
    })()
  }, [])

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid #E0E0E0',
      }}
    >
      <Toolbar
        sx={{
          height: 60,
          minHeight: '60px !important',
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={Icon}
            sx={{
              width: 30,
              height: 30,
              mr: 1,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: 20,
            }}
          >
            App name
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            textAlign: 'right',
            lineHeight: 1.2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: 10,
            }}
          >
            {currentDate}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              fontSize: 10,
            }}
          >
            Normal Acc. / {userName}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header