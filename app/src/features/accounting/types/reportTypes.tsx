export interface TransportReportItem {
  usageDate: string;
  projectName: string;
  category: string; // '電車', 'バス' 等
  route: string;    // '三ノ宮 〜 大阪' 等
  isRoundTrip: boolean;
  amount: number;
  userName?: string;      // ★ 追加
  applicantName?: string; // ★ 追加
  userId?: string;        // ★ 追加
}

export interface ExpenseReportItem {
  usageDate: string;
  projectName: string;
  category: string; // '消耗品費', 'サーバー費' 等
  remark: string;
  amount: number;
  userName?: string;      // ★ 追加
  applicantName?: string; // ★ 追加
  userId?: string;        // ★ 追加
}

export interface ExpenseReportData {
  applicant: {
    name: string;
    userId: string;
  };
  exportDate: string;
  period: {
    start: string;
    end: string;
  };
  totalAmount: number;
  transportation: {
    items: TransportReportItem[];
    subtotal: number;
  };
  expenses: {
    items: ExpenseReportItem[];
    subtotal: number;
  };
  notes?: string;
}