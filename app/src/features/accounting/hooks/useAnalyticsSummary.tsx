import { useState, useEffect, useCallback } from 'react';
import type { Dayjs } from 'dayjs';
import apiClient from '../../../api/axiosInstance';

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

      const response = await apiClient.get<AnalyticsSummary>('/admin/analytics/summary', {
        params: {
          start: startIso,
          end: endIso,
        },
      });

      setData(response.data);
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