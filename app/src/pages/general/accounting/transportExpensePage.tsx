import BaseExpenseLayout from './baseExpensePage';
import TransportRegisterCard from '../../../features/accounting/components/cards/transportRegisterCard';
import TransportRegisterModal, { type TransportModalData } from '../../../features/accounting/components/cards/transportRegisterModal';
import { type TransportDetail, type TransportCategoryKey } from '../../../features/accounting/types/expenseTypes'; // 型をインポート

interface TransportModalAdapterProps {
  open: boolean;
  initialData: Partial<TransportDetail> | null;
  onApply: (data: TransportDetail) => void;
  onClose: () => void;
}

// BaseExpenseLayoutが要求するTransportDetailと、
// TransportRegisterModalが扱うTransportModalDataとの橋渡し（logDetailPage.tsxと同じ方式）
function TransportModalAdapter({ open, initialData, onApply, onClose }: TransportModalAdapterProps) {
  const handleApply = (data: TransportModalData) => {
    onApply({
      id: data.id || crypto.randomUUID(),
      usage_date: data.usage_date || '',
      category: (data.category || 'other') as TransportCategoryKey,
      departure: data.departure,
      arrival: data.arrival,
      is_round_trip: data.is_round_trip,
      amount: data.amount,
      status: data.status || 'pending',
    });
  };

  return (
    <TransportRegisterModal
      open={open}
      initialData={initialData}
      onApply={handleApply}
      onClose={onClose}
    />
  );
}

export default function TransportExpensePage() {
  return (
    <BaseExpenseLayout<TransportDetail>
      categoryName="交通費"
      CardComponent={TransportRegisterCard}
      ModalComponent={TransportModalAdapter}
    />
  );
}