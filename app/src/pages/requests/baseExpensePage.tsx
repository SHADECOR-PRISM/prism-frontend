import { useState, useEffect, type ComponentType, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import CardStackLayout from '../../components/layouts/cardStackLayout';
import { useCards, type BaseDetail } from '../../features/accounting/hooks/useCards';
import apiClient from '../../api/axiosInstance';

// プロジェクトの型定義
interface Project {
  id: string;
  name: string;
  total_budget: number;
  is_active: boolean;
}

// ==========================================
// 汎用レイアウトが受け取るPropsの型定義
// ==========================================
interface BaseExpenseLayoutProps<T extends BaseDetail> {
  categoryName: string;

  CardComponent: ComponentType<{ data: T; actionArea: ReactNode }>;

  ModalComponent: ComponentType<{
    open: boolean;
    initialData: Partial<T> | null;
    onApply: (data: T) => void;
    onClose: () => void;
  }>;
}

export default function BaseExpenseLayout<T extends BaseDetail>({
  categoryName,
  CardComponent,
  ModalComponent,
}: BaseExpenseLayoutProps<T>) {
  const { cards, deleteCard, saveCard } = useCards<T>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<T> | null>(null);

  // プロジェクト情報と選択状態のState
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  // プルダウンを一度でも触ったかどうかを管理するState
  const [isProjectTouched, setIsProjectTouched] = useState(false);

  // プロジェクト情報一覧の取得
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get<Project[]>('/projects');
        console.log('取得したプロジェクト一覧:', response.data);
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleAddCard = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.currentTarget.blur();

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

  // エラー判定: 「一回開いた/触った」かつ「未選択（値が空）」の場合に true
  const hasProjectError = isProjectTouched && !selectedProjectId;

  // ボタン無効化フラグ
  const isSubmitDisabled = !selectedProjectId || cards.length === 0;

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    const payload = {
      header: {
        project_id: selectedProjectId,
        type: categoryName,
      },
      details: cards.map((c) => ({
        ...c,
        id: null,
      })),
    };

    console.log(`${categoryName}の新規登録リクエスト送信:`, payload);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#F9F9F9',
      }}
    >
      {/* 1. プロジェクト選択エリア（最上部） */}
      <Box
        sx={{
          p: 3,
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#000000',
            fontWeight: 'bold',
            mb: 1.5,
          }}
        >
          {categoryName}
        </Typography>

        {/* error プロパティで赤枠表示を制御 */}
        <FormControl fullWidth size="small" error={hasProjectError}>
          <InputLabel id="project-select-label">プロジェクトを選択</InputLabel>
          <Select
            labelId="project-select-label"
            value={selectedProjectId}
            label="プロジェクトを選択"
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setIsProjectTouched(true);
            }}
            onClose={() => setIsProjectTouched(true)} // プルダウンを閉じたタイミングで判定
            onBlur={() => setIsProjectTouched(true)}  // フォーカスが外れたタイミングで判定
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
          
          {/* エラー時に赤文字メッセージを表示 */}
          {hasProjectError && (
            <FormHelperText>プロジェクトの選択は必須です</FormHelperText>
          )}
        </FormControl>
      </Box>

      {/* 2. カードスタック領域（中央） */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <CardStackLayout addCardHandler={handleAddCard}>
          {cards.map((card) => (
            <CardComponent
              key={card.id}
              data={card}
              actionArea={
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => deleteCard(card.id)}
                    sx={{
                      backgroundColor: '#FF7F7F',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: '#e57272',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <Button
                    onClick={(e) => handleEditCard(e, card.id)}
                    startIcon={<EditIcon />}
                    sx={{
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      textTransform: 'none',
                      padding: '6px 16px',
                      '&:hover': {
                        backgroundColor: '#333333',
                      },
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              }
            />
          ))}
        </CardStackLayout>
      </Box>

      {/* 3. 送信ボタン（最下部） */}
      <Box
        sx={{
          height: 88,
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E0E0E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '8px',
            height: '52px',
            fontSize: '16px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#333333',
            },
            '&.Mui-disabled': {
              backgroundColor: '#E0E0E0',
              color: '#A0A0A0',
            },
          }}
        >
          申請を送信 (Submit)
        </Button>
      </Box>

      <ModalComponent
        open={isModalOpen}
        initialData={editingData}
        onApply={handleModalApply}
        onClose={handleModalClose}
      />
    </Box>
  );
}