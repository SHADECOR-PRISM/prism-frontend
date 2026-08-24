import apiClient from '../../../api/axiosInstance';
import {
  type ApplicationPayload,
  type UpdateApplicationPayload,
} from '../utils/payloadBuilder';

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
 * 既存申請の更新・追記・削除を行うAPI（本番API接続）
 */
export const updateApplicationRequest = async (
  payload: UpdateApplicationPayload
): Promise<ApplicationUpdateResponse> => {
  // モック処理から apiClient.put による本番API呼び出しへ差し替え
  const response = await apiClient.put<ApplicationUpdateResponse>(
    '/accounting/requests',
    payload
  );
  return response.data;
};