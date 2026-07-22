import { useState } from 'react';

export interface BaseDetail {
  id: string;
  usage_date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

export function useCards<T extends BaseDetail>(initialData: T[] = []) {
  const [cards, setCards] = useState<T[]>(initialData);

  // モーダル等で入力・確定されたデータを受け取ってカードを追加する
  const addCard = (inputFields: Omit<T, 'id' | 'status'>) => {
    const newId = `temp-${crypto.randomUUID()}`;

    setCards((prev) => {
      if (prev.length >= 10) return prev;

      console.log(`[Add] ${newId}`);
      
      const newCard = {
        id: newId,
        status: 'pending', // 新規追加時は一律で初期ステータスを設定
        ...inputFields,
      } as T;

      return [...prev, newCard];
    });
  };

  // カード削除処理
  const deleteCard = (id: string) => {
    console.log(`[Delete] ${id}`);
    setCards((prev) => {
      const next = prev.filter(card => card.id !== id);
      console.log(`[Delete] Remaining: ${next.length}`);
      return next;
    });
  };

  // カード修正処理
  const updateCard = (id: string, updatedFields: Partial<T>) => {
    // console.log(`${id}:${updatedFields}`)
    setCards((prev) =>
      prev.map(card => card.id === id ? { ...card, ...updatedFields } : card)
    );
  };

  return { cards, setCards, addCard, deleteCard, updateCard };
}
