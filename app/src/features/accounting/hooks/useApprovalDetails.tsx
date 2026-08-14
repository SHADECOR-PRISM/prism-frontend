import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/axiosInstance.tsx';
import type { LogItem } from '../components/container/logContainer.tsx';
import type { BaseDetail, TransportDetail, GeneralExpenseDetail } from '../types/expenseTypes.tsx';

// 取得する詳細データの型定義（ヘッダー + 各カード配列）
export interface ContainerDetailData extends LogItem {
  transportation_details?: TransportDetail[];
  expense_details?: GeneralExpenseDetail[];
}

export function useApprovalDetails(containerId?: string) {
  const [containerData, setContainerData] = useState<ContainerDetailData | null>(null);
  const [cards, setCards] = useState<BaseDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 変更されたカードのステータスだけを保持する
  // 例: { "card-uuid-1": "approved", "card-uuid-2": "rejected" }
  const [modifiedStatuses, setModifiedStatuses] = useState<Record<string, 'pending' | 'approved' | 'rejected'>>({});

  // 1. 管理者用APIから詳細データを取得
  const fetchDetail = useCallback(async () => {
    if (!containerId) return;
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<ContainerDetailData>(`/admin/container/${containerId}`);
      const data = response.data;

      setContainerData(data);
      
      // 交通費または経費のカード一覧をセット
      const detailItems = data.transportation_details?.length 
        ? data.transportation_details 
        : data.expense_details || [];

      setCards(detailItems as BaseDetail[]);
      setModifiedStatuses({}); // 状態をリセット
    } catch (err) {
      console.error('管理者詳細データ取得エラー:', err);
      setError('詳細データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  // マウント時・コンテナID変更時に取得処理を実行
  useEffect(() => {
    let isMounted = true;
  
    const load = async () => {
      if (isMounted) {
        await fetchDetail();
      }
    };
  
    load();
  
    return () => {
      isMounted = false; // クリーンアップ関数でアンマウント時の不要な状態更新を防止
    };
  }, [fetchDetail]);

  // 2. トグルボタン操作時のステータス更新関数
  const updateCardStatus = (cardId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setModifiedStatuses((prev) => ({
      ...prev,
      [cardId]: newStatus,
    }));
  };

  // 3. 画面上に変更（未保存のステータス）があるか判定
  const isDirty = Object.keys(modifiedStatuses).length > 0;

  // 4. バックエンドへ承認結果を一括送信
  const submitApproval = async () => {
    if (!containerId || !isDirty || isSubmitting) return { success: false };

    try {
      setIsSubmitting(true);

      // バックエンドが期待するスキーマに合わせてペイロードを作成
      const payload = {
        container_id: containerId,
        details: cards.map((card) => ({
          id: card.id,
          // 変更があればその値、なければ元のステータス、それもなければ 'pending'
          status: modifiedStatuses[card.id] ?? card.status ?? 'pending',
        })),
      };

      // 管理者用の承認エンドポイントへ送信
      await apiClient.put('/admin/accounting/requests/approval', payload);

      return { success: true };
    } catch (err) {
      console.error('承認ステータス保存エラー:', err);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    containerData,
    cards,
    loading,
    error,
    isDirty,
    isSubmitting,
    modifiedStatuses,
    updateCardStatus,
    submitApproval,
    refresh: fetchDetail, // 必要に応じて再取得できる関数もエクスポート
  };
}