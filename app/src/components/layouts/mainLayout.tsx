import Box from '@mui/material/Box'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './header'
import Footer from './footer'
import { getNavItems, type UserRole } from '../../util/footerMenuResolver' 

export default function MainLayout() {
  const location = useLocation()
  
  // パス判定でロールを取得（または AuthContext 等から渡す）
  const role: UserRole = location.pathname.startsWith('/admin') ? 'admin' : 'general'
  
  // 今後カテゴリが増えたらパスからドメイン判定を渡すことも可能（例: domain: 'accounting'）
  const navItems = getNavItems({ role, domain: 'accounting' })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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

      <Footer items={navItems} />
    </Box>
  )
}