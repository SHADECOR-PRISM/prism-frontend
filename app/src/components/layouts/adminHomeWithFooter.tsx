import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import ApprovalIcon from '@mui/icons-material/Approval';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Header from './header'
import Footer, { type NavItem } from './footer'

// admin ユーザー用のフッターメニュー定義
const adminNavItems: NavItem[] = [
  {
    value: '/admin/approval',
    icon: <ApprovalIcon />,
  },
  {
    value: '/admin/print',
    icon: <LocalPrintshopOutlinedIcon />,
  },
  {
    value: '/admin/analytics',
    icon: <AssessmentOutlinedIcon />,
  },
]

function AdminHomeWithFooter() {
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

      <Footer items={adminNavItems} />
    </Box>
  )
}

export default AdminHomeWithFooter