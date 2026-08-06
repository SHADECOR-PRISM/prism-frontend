import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DynamicGridLayout from '../../components/layouts/dynamicGridLayout'; 

function GeneralApplication() {
  const navigate = useNavigate();

  return (
    <DynamicGridLayout>
      
      {/* 1つ目のボタン：交通費申請 */}
      <Button
        variant="contained"
        onClick={() => navigate('/general/application/transport')} 
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': { backgroundColor: '#F9F9F9' }
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          交通費申請
        </Typography>
      </Button>

      {/* 2つ目のボタン：経費申請 */}
      <Button
        variant="contained"
        onClick={() => navigate('/general/application/expense')} 
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': { backgroundColor: '#F9F9F9' }
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          経費申請
        </Typography>
      </Button>

    </DynamicGridLayout>
  );
}

export default GeneralApplication;