import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from '../../assets/hero.png'
import { getFastAPI } from '../../api/generated/prismApi'

function Header() {
  const [currentDate, setCurrentDate] = useState('----/--/--')
  const [userName, setUserName] = useState('----')
  const [accountType, setAccountType] = useState('General')

  useEffect(() => {
    ;(async () => {
      try {
        const profile = await getFastAPI().getMe()
        setCurrentDate(profile.current_date)
        setUserName(profile.user_name)
        setAccountType(profile.account_type ?? 'General')
      } catch {
        console.error('Unable to load user information')
      }
    })()
  }, [])

  const accountLabel = accountType === 'Admin' ? 'Admin acc.' : 'Normal acc.'

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
            {accountLabel} / {userName}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header