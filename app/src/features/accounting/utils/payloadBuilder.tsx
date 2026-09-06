// 既存の型定義ファイルからインポート（相対パスは実際の配置に合わせて調整してください）
import {
  type TransportDetail,
  type GeneralExpenseDetail,
  type BaseDetail,
  type TransportCategoryKey,
  type ExpenseCategoryKey,
} from '../types/expenseTypes';

// ==========================================
// APIリクエスト（送信用ペロード）の型定義
// バックエンドのOpenAPIスキーマ（ApplicationCreateRequest）と整合する形に絞り込む
// ==========================================
export interface TransportDetailPayload {
  id: null;
  usage_date: string;
  category: TransportCategoryKey;
  departure: string | null;
  arrival: string | null;
  is_round_trip: boolean;
  amount: number;
}

export interface ExpenseDetailPayload {
  id: null;
  usage_date: string;
  category: ExpenseCategoryKey;
  remark: string | null;
  amount: number;
}

export interface ApplicationHeaderPayload {
  project_id: string;
  type: 'expense' | 'income';
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
      remark: c.remark || null, 
      amount: Number(c.amount),
    })),
  };
};

// ==========================================
// 更新APIリクエスト（送信用ペイロード）の型定義
// ==========================================
export interface UpdateDetailPayload {
  id: string | null; // 既存カードはUUID、新規追加分（temp_始まり）は null
  usage_date: string;
  category: string;
  departure?: string | null;
  arrival?: string | null;
  is_round_trip?: boolean;
  remark?: string | null;
  amount: number;
}

export interface UpdateApplicationPayload {
  container_id: string;
  version: number;
  updated_details: UpdateDetailPayload[];
  deleted_detail_ids: string[];
  is_all_deleted: boolean;
}

// ==========================================
// 更新用ペイロード変換関数
// ==========================================
/**
 * LogDetailPage の状態から更新用 API ペイロードを構築する
 */
export const buildUpdateApplicationPayload = (
  containerId: string,
  version: number,
  categoryName: string, // "交通費" または "経費"
  cards: BaseDetail[],
  deletedDetailIds: string[]
): UpdateApplicationPayload => {
  const isTransport = categoryName === '交通費';
  const isAllDeleted = cards.length === 0;

  const updatedDetails: UpdateDetailPayload[] = cards.map((card) => {
    // 一時ID (temp_ 始まり) の場合は新規追加分なので id を null に変換
    const isTemp = card.id.startsWith('temp_');
    const targetId = isTemp ? null : card.id;

    if (isTransport) {
      const c = card as TransportDetail;
      return {
        id: targetId,
        usage_date: c.usage_date || '',
        category: c.category,
        departure: c.departure || null,
        arrival: c.arrival || null,
        is_round_trip: c.is_round_trip ?? true,
        amount: Number(c.amount),
      };
    } else {
      const c = card as GeneralExpenseDetail;
      return {
        id: targetId,
        usage_date: c.usage_date || '',
        category: c.category,
        remark: c.remark || null,
        amount: Number(c.amount),
      };
    }
  });

  return {
    container_id: containerId,
    version,
    updated_details: updatedDetails,
    deleted_detail_ids: deletedDetailIds,
    is_all_deleted: isAllDeleted,
  };
};