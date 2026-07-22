import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function CategoryIcon({category}) {
  const [text, setText] = useState("---");
  const [color, setColor] = useState("gray");

  useEffect(() => {
    switch (category) {
      case "transportation":
        setText("交通費");
        setColor("orange");
        break;

      case "expense":
        setText("経費");
        setColor("deepskyblue");
        break;

      default:
        setText("---");
        setColor("gray");
        break;
    }
  }, [category]);

  return (
    <Box sx={{ mx: "2px", px: "4px", py: "2px", borderRadius: "4px", bgcolor: color }}>
      <Typography variant="body1" sx={{ m: 0, p: 0, fontSize: "10px", color: "black" }}>
        {text}
      </Typography>
    </Box>
  )
}

export default CategoryIcon
