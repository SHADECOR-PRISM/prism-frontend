import { getFastAPI } from '../../../api/generated/prismApi';
import type {
  ApplicationCreateResponse,
  ApplicationUpdateResponse,
} from '../../../api/generated/prismApi.schemas';
import {
  type ApplicationPayload,
  type UpdateApplicationPayload,
} from '../utils/payloadBuilder';

export type { ApplicationCreateResponse, ApplicationUpdateResponse };

/**
 * 新規申請（ヘッダー + 明細一覧）を登録するAPI
 */
export const postApplicationRequest = async (
  payload: ApplicationPayload
): Promise<ApplicationCreateResponse> => {
  return getFastAPI().createApplication(payload);
};

/**
 * 既存申請の更新・追記・削除を行うAPI（本番API接続）
 */
export const updateApplicationRequest = async (
  payload: UpdateApplicationPayload
): Promise<ApplicationUpdateResponse> => {
  return getFastAPI().updateApplication(payload);
};