import BaseExpenseLayout from './baseExpensePage';
import ExpenseRegisterCard from '../../../components/elements/generalExpenseRegisterCard';
import ExpenseRegisterModal from '../../../components/elements/generalExpenseRegisterModal';
// 経費用の型を定義したと仮定
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