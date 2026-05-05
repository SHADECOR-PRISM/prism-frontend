import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"
import Header from './header.tsx'
import Footer from './footer.tsx'

function Home() {

  return (
    <>
      <Header/>
      <Box component="main" sx={{ pt: "60px", pb: "60px" }}>
        <Outlet />
      </Box>
      <Footer/>
    </>
  )
}

export default Home
