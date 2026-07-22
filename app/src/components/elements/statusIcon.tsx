import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircleIcon from '@mui/icons-material/Circle'

function StatusIcon({status}) {
  const [color, setColor] = useState("gray");

  useEffect(() => {
    setColor(status == "approved" ? "limegreen" : "red");
  }, [status]);

  return (
    <Box sx={{ m: "10px" }}>
      <CircleIcon sx={{ width: "10px", height: "10px", color: color }}/>
    </Box>
  )
}

export default StatusIcon
