import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../../../api/axiosInstance';
import { updateApplicationRequest } from '../api/requestsApi';
import { canEditCard, isTempId, isAllCardsDeleted } from '../utils/expensePolicy';
import type { ContainerDetailData, BaseDetail } from '../types/expenseTypes';

export function useLogDetails<T extends BaseDetail>(containerId: string | undefined) {
  const [containerData, setContainerData] = useState<ContainerDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 画面上で操作中のカード一覧（初期明細 + 追加明細 - 削除明細）
  const [cards, setCards] = useState<T[]>([]);
  
  // 初期カード一覧（isDirty 判定用のスナップショット）
  const [initialCards, setInitialCards] = useState<T[]>([]);

  // 削除された既存カードの ID リスト
  const [deletedDetailIds, setDeletedDetailIds] = useState<string[]>([]);

  // 送信中のローディング状態
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 1. データ取得処理
  useEffect(() => {
    if (!containerId) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<ContainerDetailData>(`/container/${containerId}`);
        if (!isMounted) return;

        const data = response.data;
        setContainerData(data);

        // カテゴリに応じて明細カードを配列化
        const rawDetails = (
          data.category === '交通費'
            ? data.transportation_details
            : data.expense_details
        ) as unknown as T[];

        setCards(rawDetails || []);
        setInitialCards(rawDetails || []);
        setDeletedDetailIds([]);
      } catch (err) {
        console.error('詳細データ取得エラー:', err);
        if (isMounted) {
          setError('データの取得に失敗しました。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [containerId]);

  // 2. 変更有無（isDirty）の判定
  const isDirty = useMemo(() => {
    // 既存カードの削除が発生している場合
    if (deletedDetailIds.length > 0) return true;

    // カード枚数が変更されている場合（新規追加）
    if (cards.length !== initialCards.length) return true;

    // カードの中身が変更されているか簡易比較
    return JSON.stringify(cards) !== JSON.stringify(initialCards);
  }, [cards, initialCards, deletedDetailIds]);

  // 3. カードの新規追加
  const addCard = useCallback((newCard: Omit<T, 'id' | 'status'>) => {
    const tempCard = {
      ...newCard,
      id: `temp_${Date.now()}`, // 一時IDを生成
      status: 'pending',
    } as T;

    setCards((prev) => [...prev, tempCard]);
  }, []);

  // 4. カードの更新（編集）
  const updateCard = useCallback(
    (updatedCard: T) => {
      // 編集可能判定（containerData と カード個別ステータスのチェック）
      if (!canEditCard(containerData?.status, updatedCard.status)) {
        alert('このカードは承認済みのため編集できません。');
        return;
      }

      setCards((prev) =>
        prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );
    },
    [containerData?.status]
  );

  // 5. カードの削除
  const deleteCard = useCallback(
    (id: string) => {
      const targetCard = cards.find((c) => c.id === id);
      if (!targetCard) return;

      if (!canEditCard(containerData?.status, targetCard.status)) {
        alert('このカードは承認済みのため削除できません。');
        return;
      }

      // 既存ID（temp_ ではない）の場合は deletedDetailIds に追記
      if (!isTempId(id)) {
        setDeletedDetailIds((prev) => [...prev, id]);
      }

      setCards((prev) => prev.filter((c) => c.id !== id));
    },
    [cards, containerData?.status]
  );

  // 6. Submit 処理（変更の保存 / コンテナ全削除）
  const submitChanges = useCallback(async () => {
    if (!containerId || !isDirty) return { success: false };

    setIsSubmitting(true);

    try {
      const isAllDeleted = isAllCardsDeleted(cards.length);

      const payload = {
        containerId,
        updatedDetails: cards,
        deletedDetailIds,
        isAllDeleted,
      };

      const response = await updateApplicationRequest(payload);

      return { success: response.success, isAllDeleted };
    } catch (err) {
      console.error('送信エラー:', err);
      alert('変更の保存に失敗しました。');
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [containerId, isDirty, cards, deletedDetailIds]);

  return {
    containerData,
    cards,
    loading,
    error,
    isDirty,
    isSubmitting,
    addCard,
    updateCard,
    deleteCard,
    submitChanges,
  };
}