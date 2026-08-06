import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

// 呼び出し側のレイアウトから渡す各メニュー項目の型定義
export interface NavItem {
  value: string;         // 遷移先パス (例: "/general/log")
  icon: React.ReactNode; // MUIアイコンコンポーネント
}

interface FooterProps {
  items: NavItem[];
}

function Footer({ items }: FooterProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <BottomNavigation
      component="footer"
      value={location.pathname}
      onChange={(_event, newValue) => {
        navigate(newValue)
      }}
      sx={{
        width: '100%',
        height: 60,
        minHeight: 60,
        flexShrink: 0,
        borderTop: '1px solid #E0E0E0',
      }}
    >
      {items.map((item) => (
        <BottomNavigationAction
          key={item.value}
          icon={item.icon}
          value={item.value}
        />
      ))}
    </BottomNavigation>
  )
}

export default Footer