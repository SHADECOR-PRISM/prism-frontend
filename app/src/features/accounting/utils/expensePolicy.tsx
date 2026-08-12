import type { BaseDetail } from '../types/expenseTypes';

/**
 * 明細（カード）が編集・削除可能かを判定する
 * @param headerStatus コンテナ（申請全体）のステータス
 * @param cardStatusOrDetail 明細個別のステータス文字列、または BaseDetail オブジェクト
 */
export const canEditCard = (
  headerStatus?: string,
  cardStatusOrDetail?: string | BaseDetail
): boolean => {
  if (headerStatus !== 'pending') return false;

  if (!cardStatusOrDetail) return false;

  // 引数が BaseDetail オブジェクトで渡された場合と文字列の場合の両方に対応
  const cardStatus =
    typeof cardStatusOrDetail === 'string'
      ? cardStatusOrDetail
      : cardStatusOrDetail.status;

  return cardStatus === 'pending';
};

/**
 * 申請全体（コンテナ）が編集・新規追加可能な状態か判定する
 */
export const canEditContainer = (headerStatus?: string): boolean => {
  return headerStatus === 'pending';
};

/**
 * 明細カードが全件削除されたか（コンテナ削除フラグ用）判定する
 */
export const isAllCardsDeleted = (currentCardsCount: number): boolean => {
  return currentCardsCount === 0;
};

/**
 * 新規追加されたカード（一時ID）かどうか判定する
 */
export const isTempId = (id: string): boolean => {
  return id.startsWith('temp_');
};