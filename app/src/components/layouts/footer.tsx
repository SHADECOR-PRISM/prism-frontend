import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import LogIcon from '@mui/icons-material/ViewList'
import ApplicationIcon from '@mui/icons-material/EditDocument'
import SettingIcon from '@mui/icons-material/Settings'

function Footer(navState) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <BottomNavigation
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "60px"
      }}
      value={location.pathname}
      onChange={(event, newValue) => {
        navigate(newValue);
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
