import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface CategoryIconProps {
  category: string;
}

function CategoryIcon({ category }: CategoryIconProps) {
  // category の値に応じてテキストとカラーを判定
  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      case '交通費':
      case 'transportation': 
        return { text: '交通費', color: 'orange' };

      case '経費':
      case 'expense':        
        return { text: '経費', color: 'deepskyblue' };

      default:
        return { text: cat || '---', color: 'gray' };
    }
  };

  const { text, color } = getCategoryConfig(category);

  return (
    <Box sx={{ mx: '2px', px: '4px', py: '2px', borderRadius: '4px', bgcolor: color }}>
      <Typography variant="body1" sx={{ m: 0, p: 0, fontSize: '10px', color: 'black' }}>
        {text}
      </Typography>
    </Box>
  );
}

export default CategoryIcon;