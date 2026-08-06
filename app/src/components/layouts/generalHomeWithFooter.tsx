import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import LogIcon from '@mui/icons-material/ViewList'
import ApplicationIcon from '@mui/icons-material/EditDocument'
import SettingIcon from '@mui/icons-material/Settings'
import Header from './header'
import Footer, { type NavItem } from './footer'

// general ユーザー用のフッターメニュー定義
const generalNavItems: NavItem[] = [
  {
    value: '/general/log',
    icon: <LogIcon />,
  },
  {
    value: '/general/application',
    icon: <ApplicationIcon />,
  },
  {
    value: '/general/setting',
    icon: <SettingIcon />,
  },
]

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

      <Footer items={generalNavItems} />
    </Box>
  )
}

export default HomeWithFooter