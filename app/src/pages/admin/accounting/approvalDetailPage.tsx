import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';

import CardStackLayout from '../../../components/layouts/cardStackLayout';
import ContainerHeader from '../../../features/accounting/components/container/containerHeader';
import StatusIcon from '../../../features/accounting/components/container/statusIcon';
import { useApprovalDetails } from '../../../features/accounting/hooks/useApprovalDetails';
import {
  TRANSPORT_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
  type TransportDetail,
  type GeneralExpenseDetail,
  type TransportCategoryKey,
  type ExpenseCategoryKey,
} from '../../../features/accounting/types/expenseTypes';

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 専用カスタムフックの呼び出し
  const {
    containerData,
    cards,
    loading,
    error,
    isDirty,
    isSubmitting,
    modifiedStatuses,
    modifiedComments,
    updateCardStatus,
    updateCardComment,
    submitApproval,
  } = useApprovalDetails(id);

  // 呼び出し元の画面（一覧またはStep 3）へ戻る
  const handleBackToApproval = () => {
    navigate(-1);
  };

  // 3way トグル変更時
  const handleStatusChange = (
    cardId: string,
    newStatus: 'pending' | 'approved' | 'rejected' | null
  ) => {
    if (!newStatus) return; // 未選択状態への解除を防止
    updateCardStatus(cardId, newStatus);
  };

  // 承認状態の保存（API送信）
  const handleSubmit = async () => {
    const result = await submitApproval();
    if (result.success) {
      handleBackToApproval();
    }
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
            <Button variant="outlined" onClick={handleBackToApproval}>
              承認一覧へ戻る
            </Button>
          </Box>
        ) : containerData ? (
          <CardStackLayout>
            {/* 交通費のカード一覧 */}
            {containerData.category === '交通費' &&
              cards.map((item) => {
                const transportItem = item as unknown as TransportDetail;
                const currentStatus = modifiedStatuses[transportItem.id] ?? transportItem.status ?? 'pending';

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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <StatusIcon status={currentStatus} />
                          <Typography variant="caption" color="text.secondary">
                            利用日: {transportItem.usage_date}
                          </Typography>
                        </Box>
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

                    {/* 管理者用：3way 承認トグルボタン */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <ToggleButtonGroup
                        value={currentStatus}
                        exclusive
                        onChange={(_, newStatus) => handleStatusChange(transportItem.id, newStatus)}
                        size="small"
                        sx={{ height: '36px' }}
                      >
                        <ToggleButton
                          value="pending"
                          sx={{
                            fontWeight: 'bold',
                            '&.Mui-selected': { backgroundColor: '#E0E0E0', color: '#666666' },
                          }}
                        >
                          保留
                        </ToggleButton>
                        <ToggleButton
                          value="approved"
                          sx={{
                            fontWeight: 'bold',
                            '&.Mui-selected': { backgroundColor: '#4CAF50', color: '#FFFFFF' },
                          }}
                        >
                          承認
                        </ToggleButton>
                        <ToggleButton
                          value="rejected"
                          sx={{
                            fontWeight: 'bold',
                            '&.Mui-selected': { backgroundColor: '#F44336', color: '#FFFFFF' },
                          }}
                        >
                          却下
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    {/* 管理者用：コメント入力欄（却下理由など） */}
                    <TextField
                      label="コメント（却下理由など）"
                      fullWidth
                      multiline
                      size="small"
                      value={modifiedComments[transportItem.id] ?? transportItem.comment ?? ''}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          updateCardComment(transportItem.id, e.target.value);
                        }
                      }}
                      helperText={`${(modifiedComments[transportItem.id] ?? transportItem.comment ?? '').length}/100文字`}
                      sx={{ mt: 1.5 }}
                      slotProps={{ htmlInput: { maxLength: 100 } }}
                    />
                  </Box>
                );
              })}

            {/* 経費のカード一覧 */}
            {containerData.category === '経費' &&
              cards.map((item) => {
                const expenseItem = item as unknown as GeneralExpenseDetail;
                const currentStatus = modifiedStatuses[expenseItem.id] ?? expenseItem.status ?? 'pending';

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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <StatusIcon status={currentStatus} />
                          <Typography variant="caption" color="text.secondary">
                            利用日: {expenseItem.usage_date}
                          </Typography>
                        </Box>
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

                    {/* 管理者用：3way 承認トグルボタン */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <ToggleButtonGroup
                        value={currentStatus}
                        exclusive
                        onChange={(_, newStatus) => handleStatusChange(expenseItem.id, newStatus)}
                        size="small"
                        sx={{ height: '36px' }}
                      >
                        <ToggleButton
                          value="pending"
                          sx={{
                            fontWeight: 'bold',
                            '&.Mui-selected': { backgroundColor: '#E0E0E0', color: '#666666' },
                          }}
                        >
                          保留
                        </ToggleButton>
                        <ToggleButton
                          value="approved"
                          sx={{
                            fontWeight: 'bold',
                            '&.Mui-selected': { backgroundColor: '#4CAF50', color: '#FFFFFF' },
                          }}
                        >
                          承認
                        </ToggleButton>
                        <ToggleButton
                          value="rejected"
                          sx={{
                            fontWeight: 'bold',
                            '&.Mui-selected': { backgroundColor: '#F44336', color: '#FFFFFF' },
                          }}
                        >
                          却下
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    {/* 管理者用：コメント入力欄（却下理由など） */}
                    <TextField
                      label="コメント（却下理由など）"
                      fullWidth
                      multiline
                      size="small"
                      value={modifiedComments[expenseItem.id] ?? expenseItem.comment ?? ''}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          updateCardComment(expenseItem.id, e.target.value);
                        }
                      }}
                      helperText={`${(modifiedComments[expenseItem.id] ?? expenseItem.comment ?? '').length}/100文字`}
                      sx={{ mt: 1.5 }}
                      slotProps={{ htmlInput: { maxLength: 100 } }}
                    />
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

      {/* 3. 最下部固定：承認確定ボタンエリア */}
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
            '承認結果を保存'
          )}
        </Button>
      </Box>
    </Box>
  );
}