import { useState, useEffect, useCallback } from 'react';
import type { Dayjs } from 'dayjs';
import { getFastAPI } from '../../../api/generated/prismApi';

// 表示コンポーネント側は必須フィールドを前提にしているため、
// バックエンドのOpenAPIスキーマ（各カウントがoptional）から取得した値をここで正規化する
export interface StatusCounts {
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

export interface ExpenseBreakdown {
  transport: number;
  general: number;
  total: number;
}

export interface AnalyticsSummary {
  status_counts: StatusCounts;
  expenses: ExpenseBreakdown;
}

export function useAnalyticsSummary(fromDate: Dayjs | null, toDate: Dayjs | null) {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. 集計データ取得関数
  const fetchSummary = useCallback(async () => {
    if (!fromDate || !toDate) return;

    try {
      setLoading(true);
      setError(null);

      const startIso = fromDate.startOf('day').toISOString();
      const endIso = toDate.endOf('day').toISOString();

      const result = await getFastAPI().getAdminAnalyticsSummary({
        start: startIso,
        end: endIso,
      });

      // バックエンドのカウント値はoptionalなため、表示側の必須フィールドへ正規化する
      setData({
        status_counts: {
          approved: result.status_counts.approved ?? 0,
          pending: result.status_counts.pending ?? 0,
          rejected: result.status_counts.rejected ?? 0,
          total: result.status_counts.total ?? 0,
        },
        expenses: {
          transport: result.expenses.transport ?? 0,
          general: result.expenses.general ?? 0,
          total: result.expenses.total ?? 0,
        },
      });
    } catch (err) {
      console.error('アナリティクス集計データ取得エラー:', err);
      setError('集計データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  // 2. マウント時および期間変更時に取得
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (isMounted) {
        await fetchSummary();
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchSummary]);

  return {
    data,
    loading,
    error,
    refresh: fetchSummary,
  };
}