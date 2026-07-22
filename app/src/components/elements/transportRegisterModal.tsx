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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ 修正ポイント: useEffectの代わりに、前回のopen状態をStateで保持する
  const [prevOpen, setPrevOpen] = useState(false);

  // ✅ 修正ポイント: openが false -> true に切り替わった瞬間に初期値をセットする
  if (open && !prevOpen) {
    const mergedData = { ...defaultData, ...initialData };
    setFormData(mergedData);
    setAmountInput(mergedData.amount ? mergedData.amount.toString() : '0');
    setErrors({});
    setPrevOpen(true);
  } else if (!open && prevOpen) {
    // 閉じた時に状態を更新
    setPrevOpen(false);
  }

  // 入力ハンドラー
  const handleChange = (field: keyof TransportModalData, value: string | number | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 金額入力ハンドラー
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setAmountInput(value);
      if (errors.amount) {
        setErrors((prev) => ({ ...prev, amount: undefined }));
      }
    }
  };

  // バリデーションチェック
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.usage_date) newErrors.usage_date = '利用日を選択してください';
    if (!formData.category) newErrors.category = '交通手段を選択してください';
    if (!formData.departure?.trim()) newErrors.departure = '出発地を入力してください';
    if (!formData.arrival?.trim()) newErrors.arrival = '到着地を入力してください';
    if (amountInput === '' || isNaN(Number(amountInput))) newErrors.amount = '金額を入力してください';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 適用ボタン処理
  const handleApply = () => {
    if (!validate()) return;

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
          <TextField
            label="利用日"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }} // ✅ 新しい書き方（slotPropsでまとめる）
            value={formData.usage_date || ''}
            onChange={(e) => handleChange('usage_date', e.target.value)}
            error={!!errors.usage_date}
            helperText={errors.usage_date}
          />

          <TextField
            select
            label="交通手段"
            fullWidth
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            error={!!errors.category}
            helperText={errors.category}
          >
            <MenuItem value="電車">電車</MenuItem>
            <MenuItem value="バス">バス</MenuItem>
            <MenuItem value="タクシー">タクシー</MenuItem>
            <MenuItem value="飛行機">飛行機</MenuItem>
          </TextField>

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

          <TextField
            label="出発地"
            fullWidth
            value={formData.departure || ''}
            onChange={(e) => handleChange('departure', e.target.value)}
            error={!!errors.departure}
            helperText={errors.departure}
          />

          <TextField
            label="到着地"
            fullWidth
            value={formData.arrival || ''}
            onChange={(e) => handleChange('arrival', e.target.value)}
            error={!!errors.arrival}
            helperText={errors.arrival}
          />

          <TextField
            label="金額 (円)"
            fullWidth
            value={amountInput}
            onChange={handleAmountChange}
            error={!!errors.amount}
            helperText={errors.amount}
            slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]*' } }} // ✅ inputPropsの新しい書き方
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pb: 3 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleApply}
          sx={{ 
            backgroundColor: '#000000', 
            color: '#FFFFFF',
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#333333' }
          }}
        >
          適用 (Apply)
        </Button>
      </DialogActions>
    </Dialog>
  );
}