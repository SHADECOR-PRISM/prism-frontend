import { useEffect, useState } from 'react';
import apiClient from '../api/axiosInstance';

import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container';

interface UserProfile {
  user_id: string;
  user_name: string;
  account_type: 'Admin' | 'General';
  current_date: string;
}

function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {/* User Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
        <Avatar 
          sx={{ width: 80, height: 80, fontSize: '2rem' }}
        >
          {profile?.user_name.charAt(0)}
        </Avatar>
        <Box sx={{textAlign: 'left'}}>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
            {profile?.user_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {profile?.user_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile?.account_type} Acc.
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      {/* 今後ここに追加 */}

    </Container>
  );
};

export default Settings;