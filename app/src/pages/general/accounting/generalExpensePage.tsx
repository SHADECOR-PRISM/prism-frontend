import BaseExpenseLayout from './baseExpensePage';
import ExpenseRegisterCard from '../../../features/accounting/components/cards/generalExpenseRegisterCard';
import ExpenseRegisterModal from '../../../features/accounting/components/cards/generalExpenseRegisterModal';
import { type GeneralExpenseDetail } from '../../../features/accounting/types/expenseTypes'; 

export default function GeneralExpensePage() {
  return (
    <BaseExpenseLayout<GeneralExpenseDetail>
      categoryName="経費"
      CardComponent={ExpenseRegisterCard}
      ModalComponent={ExpenseRegisterModal}
    />
  );
}