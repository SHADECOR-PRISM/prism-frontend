import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import StatusIcon from '../elements/statusIcon.tsx'
import CategoryIcon from '../elements/categoryIcon.tsx'

function LogContainer({logData}) {
  
  return (
    <Button sx={{ display: "flex", alignItems: "center", width: "100%", color: "gray" }}>
      <StatusIcon status={logData.status} />
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ mx: "2px", fontSize: "12px", color: "black" }}>
            {logData.project_name}
          </Typography>
          <Typography variant="body1" sx={{ mx: "2px", fontSize: "12px" }}>
            {logData.applied_at}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CategoryIcon category={logData.category} />
          <Typography variant="body1" sx={{ mx: "2px", fontSize: "12px" }}>
            合計:{logData.total_amount}円
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant="caption" sx={{ textAlign: "right", fontSize: "10px", color: "black" }}>
        {logData.user_id}
      </Typography>
      <NavigateNextIcon sx={{ width: "30px", height: "30px", color: "gray" }}/>
    </Button>
  )
}

export default LogContainer
