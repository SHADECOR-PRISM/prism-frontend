import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';

import CardStackLayout from '../../../components/layouts/cardStackLayout';
import ContainerHeader from '../../../features/accounting/components/container/containerHeader';
import { useLogDetails } from '../../../features/accounting/hooks/useLogDetails';
import {
  canEditCard,
  canEditContainer,
} from '../../../features/accounting/utils/expensePolicy';
import {
  TRANSPORT_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
  type BaseDetail,
  type TransportDetail,
  type GeneralExpenseDetail,
  type TransportCategoryKey,
  type ExpenseCategoryKey,
} from '../../../features/accounting/types/expenseTypes';

// モーダルコンポーネントおよびモーダル用の型をインポート
import TransportRegisterModal, {
  type TransportModalData,
} from '../../../features/accounting/components/cards/transportRegisterModal';
import GeneralExpenseRegisterModal, {
  type GeneralExpenseModalData,
} from '../../../features/accounting/components/cards/generalExpenseRegisterModal';

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. カスタムフックからデータと操作関数を取得
  const {
    containerData,
    cards,
    loading,
    error,
    isDirty,
    isSubmitting,
    addCard,
    updateCard,
    deleteCard,
    submitChanges,
  } = useLogDetails<BaseDetail>(id);

  // 2. モーダル制御用のステート
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<BaseDetail> | null>(null);

  // Log一覧へ移動
  const handleBackToLog = () => {
    navigate('/general/accounting/log');
  };

  // 新規追加ボタン押下
  const handleAddCard = () => {
    if (!canEditContainer(containerData?.status)) {
      alert('この申請は承認済みのため追加できません。');
      return;
    }
    setEditingData(null);
    setIsModalOpen(true);
  };

  // カード編集ボタン押下
  const handleEditCard = (e: React.MouseEvent<HTMLButtonElement>, cardId: string) => {
    e.currentTarget.blur();
    const targetCard = cards.find((c) => c.id === cardId);
    if (!targetCard) return;

    if (!canEditCard(containerData?.status, targetCard.status)) {
      alert('このカードは承認済みのため編集できません。');
      return;
    }

    setEditingData(targetCard);
    setIsModalOpen(true);
  };

  // 交通費モーダルからの適用（保存）処理
  const handleTransportApply = (data: TransportModalData) => {
    const detail: TransportDetail = {
      id: data.id || `temp_${Date.now()}`,
      usage_date: data.usage_date || '',
      category: (data.category || 'other') as TransportCategoryKey,
      departure: data.departure,
      arrival: data.arrival,
      is_round_trip: data.is_round_trip,
      amount: data.amount,
      status: data.status || 'pending',
    };

    if (editingData && editingData.id) {
      updateCard(detail as unknown as BaseDetail);
    } else {
      addCard(detail as unknown as BaseDetail);
    }
    setIsModalOpen(false);
  };

  // 経費モーダルからの適用（保存）処理（description ➔ remark の相互変換）
  const handleExpenseApply = (data: GeneralExpenseModalData) => {
    const detail: GeneralExpenseDetail = {
      id: data.id || `temp_${Date.now()}`,
      usage_date: data.usage_date || '',
      category: (data.category || 'others') as ExpenseCategoryKey,
      remark: data.description, // モーダルの description を GeneralExpenseDetail の remark にマッピング
      amount: data.amount,
      status: data.status || 'pending',
    };

    if (editingData && editingData.id) {
      updateCard(detail as unknown as BaseDetail);
    } else {
      addCard(detail as unknown as BaseDetail);
    }
    setIsModalOpen(false);
  };

  // モーダルクローズ
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 送信処理（変更がある場合のみ実行可能）
  const handleSubmit = async () => {
    if (!isDirty || isSubmitting) return;

    const result = await submitChanges();
    if (result.success) {
      if (result.isAllDeleted) {
        alert('全カードが削除されたため、申請自体を削除しました。');
      } else {
        alert('変更を保存しました。');
      }
      handleBackToLog();
    }
  };

  const isContainerEditable = canEditContainer(containerData?.status);

  // 経費編集時の initialData（remark ➔ description への相互変換）
  const getExpenseInitialData = (): Partial<GeneralExpenseModalData> | null => {
    if (!editingData) return null;
    const expenseItem = editingData as unknown as GeneralExpenseDetail;
    return {
      ...expenseItem,
      description: expenseItem.remark || null,
    };
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
      {/* 1. コンテナ情報ヘッダー */}
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

      {/* 2. カードスタック領域 */}
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
          <CardStackLayout addCardHandler={isContainerEditable ? handleAddCard : undefined}>
            {/* 交通費のカード一覧 */}
            {containerData.category === '交通費' &&
              cards.map((item) => {
                const transportItem = item as unknown as TransportDetail;
                const isEditable = canEditCard(containerData.status, transportItem.status);

                return (
                  <Box
                    key={transportItem.id}
                    sx={{
                      p: 2.5,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E0E0E0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          利用日: {transportItem.usage_date}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {TRANSPORT_CATEGORY_LABELS[transportItem.category as TransportCategoryKey] || transportItem.category}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {transportItem.departure || '未設定'} ➔ {transportItem.arrival || '未設定'}
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({transportItem.is_round_trip ? '往復' : '片道'})
                        </Typography>
                      </Typography>
                      <Typography variant="h6" align="right" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                        ¥{transportItem.amount.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* アクションボタン */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
                      <IconButton
                        onClick={() => deleteCard(transportItem.id)}
                        disabled={!isEditable}
                        sx={{
                          backgroundColor: '#FF7F7F',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          '&:hover': { backgroundColor: '#e57272' },
                          '&.Mui-disabled': { backgroundColor: '#E0E0E0', color: '#A0A0A0' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>

                      <Button
                        onClick={(e) => handleEditCard(e, transportItem.id)}
                        disabled={!isEditable}
                        startIcon={<EditIcon />}
                        sx={{
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          textTransform: 'none',
                          padding: '6px 16px',
                          '&:hover': { backgroundColor: '#333333' },
                          '&.Mui-disabled': { backgroundColor: '#E0E0E0', color: '#A0A0A0' },
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Box>
                );
              })}

            {/* 経費のカード一覧 */}
            {containerData.category === '経費' &&
              cards.map((item) => {
                const expenseItem = item as unknown as GeneralExpenseDetail;
                const isEditable = canEditCard(containerData.status, expenseItem.status);

                return (
                  <Box
                    key={expenseItem.id}
                    sx={{
                      p: 2.5,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E0E0E0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          利用日: {expenseItem.usage_date}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {EXPENSE_CATEGORY_LABELS[expenseItem.category as ExpenseCategoryKey] || expenseItem.category}
                        </Typography>
                      </Box>
                      {expenseItem.remark && (
                        <Typography variant="body2" color="text.primary" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                          {expenseItem.remark}
                        </Typography>
                      )}
                      <Typography variant="h6" align="right" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                        ¥{expenseItem.amount.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* アクションボタン */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
                      <IconButton
                        onClick={() => deleteCard(expenseItem.id)}
                        disabled={!isEditable}
                        sx={{
                          backgroundColor: '#FF7F7F',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          '&:hover': { backgroundColor: '#e57272' },
                          '&.Mui-disabled': { backgroundColor: '#E0E0E0', color: '#A0A0A0' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>

                      <Button
                        onClick={(e) => handleEditCard(e, expenseItem.id)}
                        disabled={!isEditable}
                        startIcon={<EditIcon />}
                        sx={{
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          textTransform: 'none',
                          padding: '6px 16px',
                          '&:hover': { backgroundColor: '#333333' },
                          '&.Mui-disabled': { backgroundColor: '#E0E0E0', color: '#A0A0A0' },
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Box>
                );
              })}
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
          disabled={!isDirty || isSubmitting}
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '8px',
            height: '52px',
            fontSize: '16px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#333333' },
            '&.Mui-disabled': { backgroundColor: '#E0E0E0', color: '#A0A0A0' },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
          ) : (
            '変更を保存 (Submit)'
          )}
        </Button>
      </Box>

      {/* 4. カテゴリに応じて適切なモーダルを表示 */}
      {containerData?.category === '交通費' ? (
        <TransportRegisterModal
          open={isModalOpen}
          initialData={editingData as Partial<TransportModalData>}
          onApply={handleTransportApply}
          onClose={handleModalClose}
        />
      ) : (
        <GeneralExpenseRegisterModal
          open={isModalOpen}
          initialData={getExpenseInitialData()}
          onApply={handleExpenseApply}
          onClose={handleModalClose}
        />
      )}
    </Box>
  );
}