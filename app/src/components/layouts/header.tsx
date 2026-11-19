import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout'
import Icon from '../../assets/favicon.svg'
import { getFastAPI } from '../../api/generated/prismApi'
import { setAccessToken } from '../../api/axiosInstance'

function Header() {
  const [currentDate, setCurrentDate] = useState('----/--/--')
  const [userName, setUserName] = useState('----')
  const [accountType, setAccountType] = useState('General')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

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

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await getFastAPI().logout()
    } catch {
      console.error('Logout request failed')
    } finally {
      // 失敗してもクライアント側の認証情報は破棄する。
      // 全体を再読み込みしてApp側の認証状態・画面内の状態を確実に初期化する
      setAccessToken(null)
      window.location.replace('/login')
    }
  }

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
            PRISM
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

        <IconButton
          aria-label="ログアウト"
          onClick={() => setConfirmOpen(true)}
          sx={{ ml: 1, color: '#000000' }}
        >
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Toolbar>

      <Dialog open={confirmOpen} onClose={() => !loggingOut && setConfirmOpen(false)}>
        <DialogTitle sx={{ fontSize: 16 }}>ログアウトしますか？</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={loggingOut}>
            キャンセル
          </Button>
          <Button onClick={handleLogout} disabled={loggingOut} color="error">
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  )
}

export default Header