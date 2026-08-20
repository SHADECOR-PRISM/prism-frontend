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
 * @param headerStatus コンテナ（申請全体）のステータス
 * @param cardStatusOrDetail 明細個別のステータス文字列、または BaseDetail オブジェクト
 */
export const canEditCard = (
  headerStatus?: string,
  cardStatusOrDetail?: string | BaseDetail
): boolean => {
  if (headerStatus !== 'pending') return false;

  return resolveCardStatus(cardStatusOrDetail) === 'pending';
};

/**
 * 明細（カード）が削除可能かを判定する
 * - コンテナが rejected: 全明細を削除可
 * - 明細が rejected: その明細は削除のみ可（編集不可）
 * - それ以外: 編集可能な明細と同じ条件
 */
export const canDeleteCard = (
  headerStatus?: string,
  cardStatusOrDetail?: string | BaseDetail
): boolean => {
  if (headerStatus === 'approved') return false;
  if (headerStatus === 'rejected') return true;
  if (
    headerStatus === 'pending' &&
    resolveCardStatus(cardStatusOrDetail) === 'rejected'
  ) {
    return true;
  }

  return canEditCard(headerStatus, cardStatusOrDetail);
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