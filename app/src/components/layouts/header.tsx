import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from '../../assets/hero.png'

function Header() {

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar sx={{ height: "60px" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box component="img" src={Icon} sx={{ width: "30px", height: "30px", m: "10px" }} />
          <Typography variant="h1" sx={{ fontSize: "20px" }}>App name</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ textAlign: "right", lineHeight: "10px" }}>
          <Typography variant="subtitle1" sx={{ fontSize: "10px" }}>2026/04/22</Typography>
          <Typography variant="subtitle1" sx={{ fontSize: "10px" }}>Normal Acc./Yamada Taro</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
