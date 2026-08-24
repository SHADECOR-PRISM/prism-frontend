import BaseExpenseLayout from './baseExpensePage';
import ExpenseRegisterCard from '../../../features/accounting/components/cards/generalExpenseRegisterCard';
import ExpenseRegisterModal, { type GeneralExpenseModalData } from '../../../features/accounting/components/cards/generalExpenseRegisterModal';
import { type GeneralExpenseDetail, type ExpenseCategoryKey } from '../../../features/accounting/types/expenseTypes';

interface ExpenseModalAdapterProps {
  open: boolean;
  initialData: Partial<GeneralExpenseDetail> | null;
  onApply: (data: GeneralExpenseDetail) => void;
  onClose: () => void;
}

// BaseExpenseLayoutが要求するGeneralExpenseDetailと、
// ExpenseRegisterModalが扱うGeneralExpenseModalDataとの橋渡し
// （description ⇔ remark の相互変換はlogDetailPage.tsxと同じ方式）
function ExpenseModalAdapter({ open, initialData, onApply, onClose }: ExpenseModalAdapterProps) {
  const modalInitialData: Partial<GeneralExpenseModalData> | null = initialData && {
    ...initialData,
    description: initialData.remark ?? null,
  };

  const handleApply = (data: GeneralExpenseModalData) => {
    onApply({
      id: data.id || crypto.randomUUID(),
      usage_date: data.usage_date || '',
      category: (data.category || 'others') as ExpenseCategoryKey,
      remark: data.description,
      amount: data.amount,
      status: data.status || 'pending',
    });
  };

  return (
    <ExpenseRegisterModal
      open={open}
      initialData={modalInitialData}
      onApply={handleApply}
      onClose={onClose}
    />
  );
}

export default function GeneralExpensePage() {
  return (
    <BaseExpenseLayout<GeneralExpenseDetail>
      categoryName="経費"
      CardComponent={ExpenseRegisterCard}
      ModalComponent={ExpenseModalAdapter}
    />
  );
}