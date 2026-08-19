// ==========================================
// 全ての明細に共通するベースとなる型
// ==========================================
export interface BaseDetail {
  id: string;
  usage_date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

// ==========================================
// 交通費用の型（BaseDetailを拡張）
// ==========================================
export interface TransportDetail extends BaseDetail {
  category: TransportCategoryKey;       // 電車、バス、タクシー、飛行機など
  departure?: string | null;            // 出発地
  arrival?: string | null;              // 到着地
  is_round_trip: boolean;               // 往復かどうか
  created_at?: string | null;
}

// 交通費カテゴリのUnion型（Enum値）
export type TransportCategoryKey =
  | 'train'
  | 'bus'
  | 'taxi'
  | 'air'
  | 'other';

// 英語キーから日本語表示名へのマッピング辞書
export const TRANSPORT_CATEGORY_LABELS: Record<TransportCategoryKey, string> = {
  train: '電車',
  bus: 'バス',
  taxi: 'タクシー',
  air: '飛行機',
  other: 'その他',
};

// ==========================================
// 経費用の型（BaseDetailを拡張）
// ==========================================
export interface GeneralExpenseDetail extends BaseDetail {
  category: ExpenseCategoryKey;       // 消耗品、交際費、会議費など
  remark?: string | null;             // ★ description から remark に変更（利用用途詳細）
  created_at?: string | null;
}

// 経費カテゴリのUnion型（Enum値）
export type ExpenseCategoryKey =
  | 'system_admin'
  | 'supplies'
  | 'software_license'
  | 'rental'
  | 'travel_expenses'
  | 'food_beverage'
  | 'service_fee'
  | 'others';

// 英語キーから日本語表示名へのマッピング辞書
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategoryKey, string> = {
  system_admin: 'システム管理費',
  supplies: '備品・消耗品費',
  software_license: 'ライセンス・素材費',
  rental: 'レンタル費',
  travel_expenses: '旅費',
  food_beverage: '飲食・イベント費',
  service_fee: '手数料',
  others: 'その他雑費',
};

// ==========================================
// GET /container/{container_id} レスポンス型
// ==========================================
export interface ContainerDetailData {
  id: string;
  user_id: string;
  user_name?: string | null; // ★ バックエンドと合わせて追加
  project_name: string;
  category: string; // "交通費" または "経費"
  applied_at: string;
  status: 'pending' | 'approved' | 'rejected';
  total_amount: number;
  version: number;
  transportation_details: TransportDetail[];
  expense_details: GeneralExpenseDetail[];
}