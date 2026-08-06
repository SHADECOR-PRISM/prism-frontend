import BaseExpenseLayout from './baseExpensePage'; 
import TransportRegisterCard from '../../../features/accounting/components/cards/transportRegisterCard';
import TransportRegisterModal from '../../../features/accounting/components/cards/transportRegisterModal';
import { type TransportDetail } from '../../../features/accounting/types/expenseTypes'; // 型をインポート

export default function TransportExpensePage() {
  return (
    <BaseExpenseLayout<TransportDetail>
      categoryName="交通費"
      CardComponent={TransportRegisterCard}
      ModalComponent={TransportRegisterModal}
    />
  );
}