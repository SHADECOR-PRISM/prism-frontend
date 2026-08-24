import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { isAxiosError } from 'axios';
import apiClient from '../../../api/axiosInstance';
import UserContainer, { type AdminUserItem } from '../../../components/elements/userContainer';

export default function UserSelectPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. マウント時にユーザー一覧を取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const res = await apiClient.get<AdminUserItem[]>('/admin/users');
        setUsers(res.data || []);
      } catch (err: unknown) {
        console.error('Fetch users error:', err);
        if (isAxiosError(err)) {
          setErrorMsg(err.response?.data?.detail || 'ユーザー一覧の取得に失敗しました');
        } else if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('予期しないエラーが発生しました');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 2. ユーザーコンテナ押下時に直接 Step 2 へ遷移
  const handleUserClick = (user: AdminUserItem) => {
    navigate('/admin/print/setting', {
      state: { selectedUser: user },
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* エラーアラート（発生時のみ表示） */}
      {errorMsg && (
        <Box sx={{ p: 2, flexShrink: 0 }}>
          <Container maxWidth="md" disableGutters>
            <Alert severity="error">{errorMsg}</Alert>
          </Container>
        </Box>
      )}

      {/* ユーザー一覧リスト領域（全画面スクロールエリア） */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          bgcolor: '#FFFFFF',
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
              <CircularProgress size="28px" color="inherit" />
            </Box>
          ) : users.length === 0 ? (
            <Typography sx={{ fontSize: '14px', color: 'grey', my: 6, textAlign: 'center' }}>
              出力対象の一般ユーザーが見つかりません
            </Typography>
          ) : (
            users.map((user) => (
              <UserContainer
                key={user.id}
                data={user}
                onClick={() => handleUserClick(user)}
              />
            ))
          )}
        </Container>
      </Box>
    </Box>
  );
}