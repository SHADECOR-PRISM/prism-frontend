import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { getFastAPI } from '../../../api/generated/prismApi';
import type { ContainerDetailResponse } from '../../../api/generated/prismApi.schemas';
import { updateApplicationRequest } from '../api/requestsApi';
import { canDeleteCard, canEditCard, isTempId } from '../utils/expensePolicy';
import { buildUpdateApplicationPayload } from '../utils/payloadBuilder'; // ★ 追加
import type { BaseDetail } from '../types/expenseTypes';

export function useLogDetails<T extends BaseDetail>(containerId: string | undefined) {
  const [containerData, setContainerData] = useState<ContainerDetailResponse | null>(null);
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

  const fetchData = useCallback(async () => {
    if (!containerId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getFastAPI().getContainerDetail(containerId);
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
      setError('データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  // 1. データ取得処理
  // fetchData は submitChanges 内の409競合時の再取得（142行目）でも再利用する共有関数のため、
  // ここでの直接呼び出しを維持する（setLoading等のリセット処理を2箇所に重複させないため）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

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

      if (!canDeleteCard(containerData?.status, targetCard.status)) {
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
    if (!containerId || !isDirty || !containerData) return { success: false };

    setIsSubmitting(true);

    try {
      // payloadBuilder を使用して送信データを整形
      const payload = buildUpdateApplicationPayload(
        containerId,
        containerData.version,
        containerData.category,
        cards,
        initialCards,
        deletedDetailIds
      );

      // API（モック）へ送信
      const response = await updateApplicationRequest(payload);

      return { success: response.success, isAllDeleted: payload.is_all_deleted };
    } catch (err) {
      console.error('送信エラー:', err);

      if (axios.isAxiosError(err) && err.response?.status === 409) {
        await fetchData();
      }

      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [containerId, isDirty, containerData, cards, initialCards, deletedDetailIds, fetchData]);

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