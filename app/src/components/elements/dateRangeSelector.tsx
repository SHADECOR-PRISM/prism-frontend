import { useState } from 'react'
import Box from '@mui/material/Box'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import type { Dayjs } from 'dayjs'

export interface DateRange {
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
}

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onChange: (newRange: DateRange) => void;
  width?: string | number;
}

function DateRangeSelector({
  dateRange,
  onChange,
  width = '100%',
}: DateRangeSelectorProps) {
  // ピッカー表示用のローカルステート
  const [tempFromDate, setTempFromDate] = useState<Dayjs | null>(dateRange.fromDate);
  const [tempToDate, setTempToDate] = useState<Dayjs | null>(dateRange.toDate);

  // 親から渡された Props の前回値を保持して比較
  const [prevDateRange, setPrevDateRange] = useState<DateRange>(dateRange);

  // 💡 useEffect を使わず、レンダーフェーズで Props の変化を同期する
  if (
    dateRange.fromDate !== prevDateRange.fromDate ||
    dateRange.toDate !== prevDateRange.toDate
  ) {
    setPrevDateRange(dateRange);
    setTempFromDate(dateRange.fromDate);
    setTempToDate(dateRange.toDate);
  }

  const isError =
    !!tempFromDate &&
    !!tempToDate &&
    tempFromDate.isAfter(tempToDate);

  // OKボタンが押されたとき (onAccept) にのみ親の onChange を呼ぶ
  const handleFromDateAccept = (newFromDate: Dayjs | null) => {
    setTempFromDate(newFromDate);
    onChange({
      fromDate: newFromDate,
      toDate: tempToDate,
    });
  };

  const handleToDateAccept = (newToDate: Dayjs | null) => {
    setTempToDate(newToDate);
    onChange({
      fromDate: tempFromDate,
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
          value={tempFromDate}
          onChange={(newValue) => setTempFromDate(newValue)}
          onAccept={handleFromDateAccept}
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
          value={tempToDate}
          onChange={(newValue) => setTempToDate(newValue)}
          onAccept={handleToDateAccept}
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