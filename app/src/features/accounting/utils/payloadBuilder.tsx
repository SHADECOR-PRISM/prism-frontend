// 既存の型定義ファイルからインポート（相対パスは実際の配置に合わせて調整してください）
import {
  type TransportDetail,
  type GeneralExpenseDetail,
  type BaseDetail,
} from '../types/expenseTypes';

// ==========================================
// APIリクエスト（送信用ペロード）の型定義
// ==========================================
export interface TransportDetailPayload {
  id: null;
  usage_date: string;
  category: string;
  departure: string | null;
  arrival: string | null;
  is_round_trip: boolean;
  amount: number;
}

export interface ExpenseDetailPayload {
  id: null;
  usage_date: string;
  category: string;
  remark: string | null;
  amount: number;
}

export interface ApplicationHeaderPayload {
  project_id: string;
  type: string;
  category: string;
}

export interface ApplicationPayload {
  header: ApplicationHeaderPayload;
  transport_details?: TransportDetailPayload[];
  expense_details?: ExpenseDetailPayload[];
}

// ==========================================
// ペロード変換関数
// ==========================================
/**
 * フロントエンドの Card/Form データを Supabase 保存用ペロードへ変換する
 */
export const buildApplicationPayload = (
  categoryName: string,
  selectedProjectId: string,
  cards: BaseDetail[]
): ApplicationPayload => {
  const isTransport = categoryName === '交通費';

  if (isTransport) {
    const transportCards = cards as TransportDetail[];
    return {
      header: {
        project_id: selectedProjectId,
        type: 'expense',        // ENUM: 'expense'
        category: categoryName, // "交通費"
      },
      transport_details: transportCards.map((c): TransportDetailPayload => ({
        id: null, // 新規登録のため null
        usage_date: c.usage_date || '',
        category: c.category,
        departure: c.departure || null,
        arrival: c.arrival || null,
        is_round_trip: c.is_round_trip ?? true,
        amount: Number(c.amount),
      })),
    };
  }

  const expenseCards = cards as GeneralExpenseDetail[];
  return {
    header: {
      project_id: selectedProjectId,
      type: 'expense',        // ENUM: 'expense'
      category: categoryName, // "経費" など
    },
    expense_details: expenseCards.map((c): ExpenseDetailPayload => ({
      id: null, // 新規登録のため null
      usage_date: c.usage_date || '',
      category: c.category,
      // 既存型の description をバックエンドが要求する remark にマッピング
      remark: c.description || null, 
      amount: Number(c.amount),
    })),
  };
};