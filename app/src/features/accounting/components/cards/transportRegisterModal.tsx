import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

// モーダルで扱うデータの型定義
export interface TransportModalData {
  id: string | null;
  usage_date: string | null;
  category: string | null;
  departure: string | null;
  arrival: string | null;
  is_round_trip: boolean;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string | null;
  comment?: string | null;
}

interface TransportRegisterModalProps {
  open: boolean;
  initialData: Partial<TransportModalData> | null;
  onApply: (data: TransportModalData) => void;
  onClose: () => void;
}

// 初期化用のデフォルト値
const defaultData: TransportModalData = {
  id: null,
  usage_date: null,
  category: null,
  departure: null,
  arrival: null,
  is_round_trip: true,
  amount: 0,
  status: 'pending',
  created_at: null,
  comment: null,
};

// タッチ状態の型定義
type TouchedFields = {
  usage_date?: boolean;
  category?: boolean;
  departure?: boolean;
  arrival?: boolean;
  amount?: boolean;
};

export default function TransportRegisterModal({
  open,
  initialData,
  onApply,
  onClose,
}: TransportRegisterModalProps) {
  // フォームの入力状態
  const [formData, setFormData] = useState<TransportModalData>(defaultData);
  const [amountInput, setAmountInput] = useState<string>('0');
  
  // 各フィールドのタッチ（フォーカス離脱）状態
  const [touched, setTouched] = useState<TouchedFields>({});

  // 前回のopen状態をStateで保持する
  const [prevOpen, setPrevOpen] = useState(false);

  // モーダルが開いた瞬間に状態をリセット
  if (open && !prevOpen) {
    const mergedData = { ...defaultData, ...initialData };
    setFormData(mergedData);
    setAmountInput(mergedData.amount ? mergedData.amount.toString() : '0');
    
    // 編集時は最初から値を保持しているため必要に応じて調整。新規時は全てuntouchedで初期化
    setTouched({});
    setPrevOpen(true);
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  // フィールドを触った（フォーカスが外れた）記録をつけるハンドラー
  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 入力ハンドラー
  const handleChange = (field: keyof TransportModalData, value: string | number | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 金額入力ハンドラー
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setAmountInput(value);
    }
  };

  // ==========================================
  // 各項目のバリデーションチェック関数
  // ==========================================
  const getUsageDateError = () => (!formData.usage_date ? '利用日を選択してください' : '');
  const getCategoryError = () => (!formData.category ? '交通手段を選択してください' : '');
  const getDepartureError = () => (!formData.departure?.trim() ? '出発地を入力してください' : '');
  const getArrivalError = () => (!formData.arrival?.trim() ? '到着地を入力してください' : '');
  const getAmountError = () => {
    if (amountInput === '' || isNaN(Number(amountInput))) return '金額を入力してください';
    if (Number(amountInput) <= 0) return '1円以上の金額を入力してください';
    return '';
  };

  // フォーム全体が有効かどうか（ボタン有効化のフラグ）
  const isValid =
    !getUsageDateError() &&
    !getCategoryError() &&
    !getDepartureError() &&
    !getArrivalError() &&
    !getAmountError();

  // 適用ボタン処理
  const handleApply = () => {
    if (!isValid) return;

    const finalData: TransportModalData = {
      ...formData,
      id: formData.id || crypto.randomUUID(),
      amount: Number(amountInput),
      created_at: formData.created_at || new Date().toISOString(),
    };

    onApply(finalData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
        {formData.id ? '交通費の編集' : '交通費の新規登録'}
      </DialogTitle>
      
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* 利用日 */}
          <TextField
            label="利用日"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={formData.usage_date || ''}
            onChange={(e) => handleChange('usage_date', e.target.value)}
            onBlur={() => handleBlur('usage_date')}
            error={!!touched.usage_date && !!getUsageDateError()}
            helperText={touched.usage_date ? getUsageDateError() : ''}
          />

          {/* 交通手段 */}
          <TextField
            select
            label="交通手段"
            fullWidth
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            error={!!touched.category && !!getCategoryError()}
            helperText={touched.category ? getCategoryError() : ''}
          >
            <MenuItem value="train">電車</MenuItem>
            <MenuItem value="bus">バス</MenuItem>
            <MenuItem value="taxi">タクシー</MenuItem>
            <MenuItem value="air">飛行機</MenuItem>
            <MenuItem value="other">その他</MenuItem>
          </TextField>

          {/* 片道 / 往復 */}
          <TextField
            select
            label="片道 / 往復"
            fullWidth
            value={formData.is_round_trip ? 'round_trip' : 'one_way'}
            onChange={(e) => handleChange('is_round_trip', e.target.value === 'round_trip')}
          >
            <MenuItem value="one_way">片道</MenuItem>
            <MenuItem value="round_trip">往復</MenuItem>
          </TextField>

          {/* 出発地 */}
          <TextField
            label="出発地"
            fullWidth
            value={formData.departure || ''}
            onChange={(e) => handleChange('departure', e.target.value)}
            onBlur={() => handleBlur('departure')}
            error={!!touched.departure && !!getDepartureError()}
            helperText={touched.departure ? getDepartureError() : ''}
          />

          {/* 到着地 */}
          <TextField
            label="到着地"
            fullWidth
            value={formData.arrival || ''}
            onChange={(e) => handleChange('arrival', e.target.value)}
            onBlur={() => handleBlur('arrival')}
            error={!!touched.arrival && !!getArrivalError()}
            helperText={touched.arrival ? getArrivalError() : ''}
          />

          {/* 金額 */}
          <TextField
            label="金額 (円)"
            fullWidth
            value={amountInput}
            onChange={handleAmountChange}
            onBlur={() => handleBlur('amount')}
            error={!!touched.amount && !!getAmountError()}
            helperText={touched.amount ? getAmountError() : ''}
            slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]*' } }}
          />

          {/* 管理者からのコメント（読み取り専用） */}
          {formData.comment && (
            <TextField
              label="管理者からのコメント（前回の却下理由）"
              fullWidth
              multiline
              minRows={2}
              value={formData.comment}
              slotProps={{ input: { readOnly: true } }}
              sx={{ bgcolor: '#F5F5F5' }}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pb: 3 }}>
        <Button 
          variant="contained" 
          fullWidth 
          disabled={!isValid}
          onClick={handleApply}
          sx={{ 
            backgroundColor: '#000000', 
            color: '#FFFFFF',
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#333333' },
            '&.Mui-disabled': {
              backgroundColor: '#E0E0E0',
              color: '#A0A0A0',
            },
          }}
        >
          適用 (Apply)
        </Button>
      </DialogActions>
    </Dialog>
  );
}