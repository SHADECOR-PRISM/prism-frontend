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
  category: string;       // 電車、バス、タクシー、飛行機など
  departure: string;      // 出発地
  arrival: string;        // 到着地
  is_round_trip: boolean; // 往復かどうか
  created_at?: string | null;
}

// ==========================================
// 経費用の型（BaseDetailを拡張）
// ==========================================
export interface GeneralExpenseDetail extends BaseDetail {
  category: string;       // 消耗品、交際費、会議費など
  description: string;    // 摘要（何を買ったか・目的）
  created_at?: string | null;
}