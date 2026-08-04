import apiClient from '../../../api/axiosInstance';
import { type ApplicationPayload } from '../utils/payloadBuilder';

// レスポンスの型定義
export interface ApplicationCreateResponse {
  header_id: string;
  message: string;
  total_amount: number;
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