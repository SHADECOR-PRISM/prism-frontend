import Box from '@mui/material/Box'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import type { Dayjs } from 'dayjs'

// 日付範囲のデータ型
export interface DateRange {
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
}

// コンポーネントの Props 型定義
interface DateRangeSelectorProps {
  dateRange: DateRange;
  // 日付が変更されたタイミングで最新の { fromDate, toDate } を親に渡す
  onChange: (newRange: DateRange) => void;
  // オプション: 画面に応じて横幅を調整可能（デフォルトは全幅）
  width?: string | number;
}

function DateRangeSelector({
  dateRange,
  onChange,
  width = '100%',
}: DateRangeSelectorProps) {
  // 開始日が終了日より後になっているかのエラー判定（Nullチェック含む）
  const isError =
    !!dateRange.fromDate &&
    !!dateRange.toDate &&
    dateRange.fromDate.isAfter(dateRange.toDate);

  const handleFromDateChange = (newFromDate: Dayjs | null) => {
    onChange({
      fromDate: newFromDate,
      toDate: dateRange.toDate,
    });
  };

  const handleToDateChange = (newToDate: Dayjs | null) => {
    onChange({
      fromDate: dateRange.fromDate,
      toDate: newToDate,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: width,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <MobileDatePicker
          label="開始日"
          format="YYYY/MM/DD"
          value={dateRange.fromDate}
          onChange={handleFromDateChange}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              error: isError,
              helperText: isError ? '開始日が終了日を超えています' : undefined,
            },
          }}
        />

        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
          〜
        </Box>

        <MobileDatePicker
          label="終了日"
          format="YYYY/MM/DD"
          value={dateRange.toDate}
          onChange={handleToDateChange}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              error: isError,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default DateRangeSelector;