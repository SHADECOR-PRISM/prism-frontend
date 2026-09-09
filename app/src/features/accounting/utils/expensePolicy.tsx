import type { BaseDetail } from '../types/expenseTypes';

const resolveCardStatus = (
  cardStatusOrDetail?: string | BaseDetail
): string | undefined => {
  if (!cardStatusOrDetail) return undefined;

  return typeof cardStatusOrDetail === 'string'
    ? cardStatusOrDetail
    : cardStatusOrDetail.status;
};

/**
 * 明細（カード）が編集可能かを判定する
 * - コンテナが approved: 編集不可
 * - 明細が pending または rejected（却下明細の修正・再申請）: 編集可
 * @param headerStatus コンテナ（申請全体）のステータス
 * @param cardStatusOrDetail 明細個別のステータス文字列、または BaseDetail オブジェクト
 */
export const canEditCard = (
  headerStatus?: string,
  cardStatusOrDetail?: string | BaseDetail
): boolean => {
  if (headerStatus === 'approved') return false;

  const cardStatus = resolveCardStatus(cardStatusOrDetail);
  return cardStatus === 'pending' || cardStatus === 'rejected';
};

/**
 * 明細（カード）が削除可能かを判定する。
 * 現状では編集可能な条件と完全に一致する（承認済みの明細は、
 * コンテナ全体のステータスに関わらず削除できない）ため canEditCard に委譲する。
 */
export const canDeleteCard = canEditCard;

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