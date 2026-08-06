import BaseExpenseLayout from './baseExpensePage'; 
import TransportRegisterCard from '../../../components/elements/transportRegisterCard';
import TransportRegisterModal from '../../../components/elements/transportRegisterModal';
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