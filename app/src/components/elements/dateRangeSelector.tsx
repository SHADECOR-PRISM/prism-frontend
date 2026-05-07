import Box from '@mui/material/Box'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

function DateRangeSelector({dateRange, setDateRange}) {

  return (
    <>
      <Box sx={{ width: "340px", height: "40px", display: "flex", alignItems: "center", gap: "20px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            slotProps={{
              textField: {
                size: "small",
                error: dateRange.fromDate.isAfter(dateRange.toDate)
              }
            }}
            label="開始日"
            format="YYYY/MM/DD"
            value={dateRange.fromDate}
            onChange={(newDate) => setDateRange({fromDate: newDate, toDate: dateRange.toDate})}
          />
          <MobileDatePicker
            slotProps={{
              textField: {
                size: "small",
                error: dateRange.fromDate.isAfter(dateRange.toDate)
              }
            }}
            label="終了日"
            format="YYYY/MM/DD"
            value={dateRange.toDate}
            onChange={(newDate) => setDateRange({fromDate: dateRange.fromDate, toDate: newDate})}
          />
        </LocalizationProvider>
      </Box>
    </>
  )
}

export default DateRangeSelector
