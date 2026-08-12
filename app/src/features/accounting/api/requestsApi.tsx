import apiClient from '../../../api/axiosInstance';
import { type ApplicationPayload } from '../utils/payloadBuilder';
import { type BaseDetail } from '../types/expenseTypes';

// レスポンスの型定義（新規登録用）
export interface ApplicationCreateResponse {
  header_id: string;
  message: string;
  total_amount: number;
}

// レスポンスの型定義（更新・削除用）
export interface ApplicationUpdateResponse {
  success: boolean;
  message: string;
}

/**
 * 送信時にバックエンドへ送る更新用のペイロード構造
 */
export interface UpdateApplicationPayload<T extends BaseDetail = BaseDetail> {
  containerId: string;
  updatedDetails: T[];        // 既存の変更分 ＋ 新規追加分
  deletedDetailIds: string[];  // 削除された既存明細のIDリスト
  isAllDeleted: boolean;       // 明細が0件になりコンテナごと削除するかどうか
}

/**
 * 新規申請（ヘッダー + 明細一覧）を登録するAPI
 */
export const postApplicationRequest = async (
  payload: ApplicationPayload
): Promise<ApplicationCreateResponse> => {
  const response = await apiClient.post<ApplicationCreateResponse>(
    '/accounting/requests',
    payload
  );
  return response.data;
};

/**
 * 既存申請の更新・追記・削除を行うAPI（モック実装）
 * ※ バックエンド実装が完了したら apiClient.put / patch に差し替えます
 */
export const updateApplicationRequest = async <T extends BaseDetail>(
  payload: UpdateApplicationPayload<T>
): Promise<ApplicationUpdateResponse> => {
  console.log('【Mock API】更新ペイロード送信:', payload);

  // 通信の遅延を擬似的に再現 (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (payload.isAllDeleted) {
    console.log(`【Mock API】コンテナID: ${payload.containerId} を完全削除しました。`);
  } else {
    console.log(`【Mock API】コンテナID: ${payload.containerId} の更新を完了しました。`);
  }

  return {
    success: true,
    message: payload.isAllDeleted ? '申請を削除しました' : '申請を更新しました',
  };
};