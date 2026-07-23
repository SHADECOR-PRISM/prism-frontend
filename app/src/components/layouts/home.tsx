import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"
import Header from './header.tsx'
import Footer from './footer.tsx'

function Home() {

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
        <Header/>
        <Box component="main" sx={{ 
          pt: "60px", 
          pb: "60px", 
          flexGrow: 1,         
          display: 'flex',     
          flexDirection: 'column',
          overflow: 'hidden'   
        }}>
          <Outlet />
        </Box>
        <Footer/>
      </Box>
    </>
  )
}

export default Home
