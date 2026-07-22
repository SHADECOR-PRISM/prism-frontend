import { useState } from 'react';
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
export interface GeneralExpenseModalData {
  id: string | null;
  usage_date: string | null;
  category: string | null;
  description: string | null; // 摘要・利用用途詳細
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string | null;
}

interface GeneralExpenseRegisterModalProps {
  open: boolean;
  initialData: Partial<GeneralExpenseModalData> | null;
  onApply: (data: GeneralExpenseModalData) => void;
  onClose: () => void;
}

// 初期化用のデフォルト値
const defaultData: GeneralExpenseModalData = {
  id: null,
  usage_date: null,
  category: null,
  description: null,
  amount: 0,
  status: 'pending',
  created_at: null,
};

export default function GeneralExpenseRegisterModal({
  open,
  initialData,
  onApply,
  onClose,
}: GeneralExpenseRegisterModalProps) {
  // フォームの入力状態
  const [formData, setFormData] = useState<GeneralExpenseModalData>(defaultData);
  const [amountInput, setAmountInput] = useState<string>('0');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 以前のopen状態を保持（useEffectの代わり）
  const [prevOpen, setPrevOpen] = useState(false);

  // openが false -> true に切り替わった瞬間に初期値をセットする
  if (open && !prevOpen) {
    const mergedData = { ...defaultData, ...initialData };
    setFormData(mergedData);
    setAmountInput(mergedData.amount ? mergedData.amount.toString() : '0');
    setErrors({});
    setPrevOpen(true);
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  // 入力ハンドラー
  const handleChange = (field: keyof GeneralExpenseModalData, value: string | number | boolean | null) => {
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
    if (!formData.category) newErrors.category = '申請種別を選択してください';
    
    // 必須チェック ＆ 100文字超過チェック
    if (!formData.description?.trim()) {
      newErrors.description = '利用用途詳細を入力してください';
    } else if (formData.description.length > 100) {
      newErrors.description = '100文字以内で入力してください';
    }
    
    if (amountInput === '' || isNaN(Number(amountInput))) newErrors.amount = '金額を入力してください';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 適用ボタン処理
  const handleApply = () => {
    if (!validate()) return;

    const finalData: GeneralExpenseModalData = {
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
        {formData.id ? '経費の編集' : '経費の新規登録'}
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
            error={!!errors.usage_date}
            helperText={errors.usage_date}
          />

          {/* 申請種別 (カテゴリー) */}
          <TextField
            select
            label="申請種別"
            fullWidth
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            error={!!errors.category}
            helperText={errors.category}
          >
            <MenuItem value="system_admin">システム管理費</MenuItem>
            <MenuItem value="supplies">備品・消耗品費</MenuItem>
            <MenuItem value="software_license">ライセンス・素材費</MenuItem>
            <MenuItem value="rental">レンタル費</MenuItem>
            <MenuItem value="travel_expenses">旅費</MenuItem>
            <MenuItem value="food_beverage">飲食・イベント費</MenuItem>
            <MenuItem value="service_fee">手数料</MenuItem>
            <MenuItem value="others">その他雑費</MenuItem>
          </TextField>

          {/* 利用用途詳細 (Description) */}
          <TextField
            label="利用用途詳細"
            fullWidth
            multiline
            rows={3} // 複数行入力しやすく
            placeholder="例: 〇〇プロジェクト用 モニター購入"
            value={formData.description || ''}
            onChange={(e) => {
              // 100文字以下の時だけStateを更新する（100文字を超えたコピペ等の防止）
              if (e.target.value.length <= 100) {
                handleChange('description', e.target.value);
              }
            }}
            error={!!errors.description}
            // エラー時はエラー文を、通常時は文字数カウンターを表示
            helperText={errors.description || `${(formData.description || '').length}/100文字`}
            slotProps={{ 
              inputLabel: { shrink: true },
              htmlInput: { maxLength: 100 } // HTMLレベルで100文字以上打てないように制限
            }}
          />

          {/* 金額 */}
          <TextField
            label="金額 (円)"
            fullWidth
            value={amountInput}
            onChange={handleAmountChange}
            error={!!errors.amount}
            helperText={errors.amount}
            slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]*' } }}
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