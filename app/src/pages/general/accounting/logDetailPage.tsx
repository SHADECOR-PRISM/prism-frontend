import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import apiClient from '../../../api/axiosInstance';
import CardStackLayout from '../../../components/layouts/cardStackLayout';
import ContainerHeader from '../../../features/accounting/components/container/containerHeader';
import {
  type ContainerDetailData,
  TRANSPORT_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
} from '../../../features/accounting/types/expenseTypes';

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 詳細データのステート管理
  const [containerData, setContainerData] = useState<ContainerDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API から明細データ付きのコンテナ詳細を取得
  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<ContainerDetailData>(`/container/${id}`);
        if (isMounted) {
          setContainerData(response.data);
        }
      } catch (err) {
        console.error('詳細データ取得エラー:', err);
        if (isMounted) {
          setError('データの取得に失敗しました。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Log一覧へ移動
  const handleBackToLog = () => {
    navigate('/general/accounting/log');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#F9F9F9',
      }}
    >
      {/* 1. コンテナ情報ヘッダー（サイズ干渉を防ぎ、ContainerHeader の自然な高さに任せる） */}
      <Box
        sx={{
          width: '100%',
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <ContainerHeader containerId={id || ''} data={containerData ?? undefined} />
      </Box>

      {/* 2. カードスタック領域（中央・ヘッダーの高さに応じて自動で押し下げられる） */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={32} sx={{ color: '#000000' }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button variant="outlined" onClick={handleBackToLog}>
              一覧（Log）へ戻る
            </Button>
          </Box>
        ) : containerData ? (
          <CardStackLayout addCardHandler={undefined}>
            {/* 交通費のカード一覧 */}
            {containerData.category === '交通費' &&
              (containerData.transportation_details && containerData.transportation_details.length > 0 ? (
                containerData.transportation_details.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 2.5,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E0E0E0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        利用日: {item.usage_date}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {TRANSPORT_CATEGORY_LABELS[item.category] || item.category}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {item.departure || '未設定'} ➔ {item.arrival || '未設定'}
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({item.is_round_trip ? '往復' : '片道'})
                      </Typography>
                    </Typography>
                    <Typography variant="h6" align="right" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                      ¥{item.amount.toLocaleString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                  交通費明細がありません。
                </Typography>
              ))}

            {/* 経費のカード一覧 */}
            {containerData.category === '経費' &&
              (containerData.expense_details && containerData.expense_details.length > 0 ? (
                containerData.expense_details.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 2.5,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E0E0E0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        利用日: {item.usage_date}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {EXPENSE_CATEGORY_LABELS[item.category] || item.category}
                      </Typography>
                    </Box>
                    {item.remark && (
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                        {item.remark}
                      </Typography>
                    )}
                    <Typography variant="h6" align="right" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                      ¥{item.amount.toLocaleString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                  経費明細がありません。
                </Typography>
              ))}
          </CardStackLayout>
        ) : (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            データが見つかりません。
          </Typography>
        )}
      </Box>

      {/* 3. 最下部固定アクションエリア */}
      <Box
        sx={{
          height: 88,
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E0E0E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={handleBackToLog}
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '8px',
            height: '52px',
            fontSize: '16px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#333333' },
          }}
        >
          Log一覧に戻る
        </Button>
      </Box>
    </Box>
  );
}