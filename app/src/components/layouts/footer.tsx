import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import LogIcon from '@mui/icons-material/ViewList'
import ApplicationIcon from '@mui/icons-material/EditDocument'
import SettingIcon from '@mui/icons-material/Settings'

function Footer() {
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
      <BottomNavigationAction
        icon={<LogIcon />}
        value="/general/log"
      />

      <BottomNavigationAction
        icon={<ApplicationIcon />}
        value="/general/application"
      />

      <BottomNavigationAction
        icon={<SettingIcon />}
        value="/general/setting"
      />
    </BottomNavigation>
  )
}

export default Footer