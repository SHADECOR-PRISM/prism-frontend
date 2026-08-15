import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DynamicGridLayout from '../../../components/layouts/dynamicGridLayout'; 

function AdminPrint() {
  const navigate = useNavigate();

  return (
    <DynamicGridLayout>
      {/* 1つ目のボタン：個人明細表 */}
      <Button
        variant="contained"
        onClick={() => navigate('/admin/print/personal')}
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': { backgroundColor: '#F9F9F9' }
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          個人明細表
        </Typography>
      </Button>

      {/* 2つ目のボタン：全体支出明細 */}
      <Button
        variant="contained"
        onClick={() => navigate('/admin/print/overall')} // 一旦ダミー遷移先
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': { backgroundColor: '#F9F9F9' }
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          全体支出明細
        </Typography>
      </Button>
    </DynamicGridLayout>
  );
}

export default AdminPrint;