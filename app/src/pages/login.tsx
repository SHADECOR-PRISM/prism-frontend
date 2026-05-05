import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import apiClient, { setAccessToken } from '../api/axiosInstance';

import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link'
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import  LoginIcon  from "@mui/icons-material/Login";
import PrismLogo from '../assets/hero.png';

function Login({ onLoginSuccess }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate()
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const auth_response = await apiClient.post("/login", {
        userId: userId,
        password: password,
      });

      console.log(auth_response.data)
      setAccessToken(auth_response.data.access_token);

      onLoginSuccess();

      navigate("/general");

    } catch {
      setErrorMessage("Incorrect ID or password");
    }
  }

  return (
    <Box 
      component="section"
      sx={{
        width: "92%",       
        height: "100%",
        mx: 'auto',
        my: 'auto',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* logo / title */}
      <Box
        sx={{
          width: "100%",
          mb: 3,
          gap: 1,
          display: 'flex',
          flexDirection: 'row',      
          alignItems: 'center',     
          justifyContent: 'center', 
        }}
      >
        <Box
          component="img"
          src={PrismLogo} 
          alt="PRISM Logo"
          sx={{
            height: 40,           
            width: 'auto',
          }}
        />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          PRISM
        </Typography>
      </Box>
    
      {/* Login form */}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          gap: 2, 
        }}
      >
        
        {/* input ID and pwd field */}
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your ID and password to sign in for this app
          </Typography>
        </Box>

        <TextField
          label="User ID"
          variant="outlined"
          fullWidth   
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && (
          <Typography variant="caption" sx={{ color: 'error.main', alignSelf: 'flex-start' }}>
            {errorMessage}
          </Typography>
        )}

        {/* Login Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          startIcon={<LoginIcon/>}
          sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
        >
          Login
        </Button>  
      </Box>

      {/* Privacy Policy */}
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
        By clicking continue, you agree to our{' '}
        <Link 
          component="button" 
          variant="caption" 
          onClick={handleOpen}
          sx={{ verticalAlign: 'baseline' }}
        >
          Privacy Policy
        </Link>
      </Typography>
      
      {/* Modal Message */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '70%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </Box>
  )
}

export default Login
