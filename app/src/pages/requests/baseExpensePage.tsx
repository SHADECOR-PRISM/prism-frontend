import { useState, type ComponentType, type ReactNode } from 'react';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CardStackLayout from '../../components/layouts/cardStackLayout';
import { useCards, type BaseDetail } from '../../features/accounting/hooks/useCards';

// ==========================================
// 汎用レイアウトが受け取るPropsの型定義
// ==========================================
interface BaseExpenseLayoutProps<T extends BaseDetail> {
  // 送信時に使うカテゴリ名（例: "交通費", "経費" など）
  categoryName: string;
  
  CardComponent: ComponentType<{ data: T; actionArea: ReactNode }>;
  
  ModalComponent: ComponentType<{
    open: boolean;
    initialData: Partial<T> | null;
    onApply: (data: T) => void;
    onClose: () => void;
  }>;
}

// ==========================================
// 汎用レイアウトコンポーネント (TはBaseDetailを拡張した何かの型)
// ==========================================
export default function BaseExpenseLayout<T extends BaseDetail>({
  categoryName,
  CardComponent,
  ModalComponent,
}: BaseExpenseLayoutProps<T>) {
  
  // ここで T（TransportDetail や ExpenseDetail）が使われる
  const { cards, deleteCard, saveCard } = useCards<T>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<T> | null>(null);

  const handleAddCard = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (id: string) => {
    const targetCard = cards.find((c) => c.id === id);
    if (targetCard) {
      setEditingData(targetCard);
      setIsModalOpen(true);
    }
  };

  const handleModalApply = (data: T) => {
    saveCard(data);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const payload = {
      header: { type: categoryName }, // Propsから受け取った文字を使う
      details: cards.map(c => ({ ...c, id: null })) 
    };
    console.log(`${categoryName}の新規登録リクエスト送信:`, payload);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100%', overflow: 'hidden', backgroundColor: '#F9F9F9' }}>
      
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <CardStackLayout addCardHandler={handleAddCard}>
          {cards.map((card) => (
            // ✅ 受け取ったカードコンポーネントをここで描画する
            <CardComponent
              key={card.id}
              data={card}
              actionArea={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => deleteCard(card.id)} sx={{ backgroundColor: '#FF7F7F', color: '#FFFFFF', borderRadius: '8px', '&:hover': { backgroundColor: '#e57272' } }}>
                    <DeleteIcon />
                  </IconButton>
                  <Button onClick={() => handleEditCard(card.id)} startIcon={<EditIcon />} sx={{ backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '8px', textTransform: 'none', padding: '6px 16px', '&:hover': { backgroundColor: '#333333' } }}>
                    Edit
                  </Button>
                </Box>
              }
            />
          ))}
        </CardStackLayout>
      </Box>

      <Box sx={{ height: '10%', minHeight: '80px', maxHeight: '120px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, zIndex: 10 }}>
        <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '8px', height: '52px', fontSize: '16px', fontWeight: 'bold', '&:hover': { backgroundColor: '#333333' } }}>
          申請を送信 (Submit)
        </Button>
      </Box>

      {/* ✅ 受け取ったモーダルコンポーネントをここで描画する */}
      <ModalComponent
        open={isModalOpen}
        initialData={editingData}
        onApply={handleModalApply}
        onClose={handleModalClose}
      />
    </Box>
  );
}