import { useState } from 'react';

export interface BaseDetail {
  id: string;
  usage_date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

export function useCards<T extends BaseDetail>(initialData: T[] = []) {
  const [cards, setCards] = useState<T[]>(initialData);

  // カード削除処理
  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter(card => card.id !== id));
  };

  // ✅ これ1つで「新規追加」も「更新」も全て対応！
  const saveCard = (cardData: T) => {
    setCards((prev) => {
      const isExisting = prev.some((card) => card.id === cardData.id);

      if (isExisting) {
        // 既存なら上書き
        return prev.map((card) => (card.id === cardData.id ? { ...card, ...cardData } : card));
      } else {
        // 新規なら追加
        if (prev.length >= 10) return prev; // 枚数制限
        return [...prev, cardData];
      }
    });
  };

  return { cards, setCards, deleteCard, saveCard };
}