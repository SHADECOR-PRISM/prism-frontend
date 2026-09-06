import dayjs from 'dayjs';
import type { ExpenseReportData, TransportReportItem, ExpenseReportItem } from '../types/reportTypes';
import {
  TRANSPORT_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
} from '../types/expenseTypes';
import type { ContainerDetailResponse } from '../../../api/generated/prismApi.schemas';

interface FormatReportParams {
  applicant: {
    name: string;
    userId: string;
  };
  period: {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
  };
  containers: ContainerDetailResponse[];
  notes?: string;
}

export function formatToReportData({
  applicant,
  period,
  containers,
  notes,
}: FormatReportParams): ExpenseReportData {
  const transportItems: TransportReportItem[] = [];
  const expenseItems: ExpenseReportItem[] = [];

  containers.forEach((container) => {
    // 申請者氏名（user_name があれば優先、なければ user_id、個人指定時の applicant.name）
    const containerUserName =
      container.user_name ||
      container.user_id ||
      applicant.name ||
      '-';

    const containerUserId = container.user_id || applicant.userId || '';

    // 交通費明細の整形（承認済みカードのみ抽出）
    container.transportation_details?.forEach((item) => {
      if (item.status === 'approved') {
        transportItems.push({
          usageDate: item.usage_date,
          projectName: container.project_name || '未設定',
          category: TRANSPORT_CATEGORY_LABELS[item.category] || item.category,
          route: `${item.departure || ''} 〜 ${item.arrival || ''}`,
          isRoundTrip: item.is_round_trip ?? true,
          amount: item.amount,
          userName: containerUserName,
          applicantName: containerUserName,
          userId: containerUserId,
        });
      }
    });

    // 経費明細の整形（承認済みカードのみ抽出）
    container.expense_details?.forEach((item) => {
      if (item.status === 'approved') {
        expenseItems.push({
          usageDate: item.usage_date,
          projectName: container.project_name || '未設定',
          category: EXPENSE_CATEGORY_LABELS[item.category] || item.category,
          remark: item.remark || '-',
          amount: item.amount,
          userName: containerUserName,
          applicantName: containerUserName,
          userId: containerUserId,
        });
      }
    });
  });

  // 利用日順にソート
  transportItems.sort((a, b) => (a.usageDate > b.usageDate ? 1 : -1));
  expenseItems.sort((a, b) => (a.usageDate > b.usageDate ? 1 : -1));

  const trSubtotal = transportItems.reduce((acc, cur) => acc + cur.amount, 0);
  const exSubtotal = expenseItems.reduce((acc, cur) => acc + cur.amount, 0);

  return {
    applicant: {
      name: applicant.name,
      userId: applicant.userId,
    },
    exportDate: dayjs().format('YYYY年 MM月 DD日'),
    period: {
      start: period.start.format('YYYY/MM/DD'),
      end: period.end.format('YYYY/MM/DD'),
    },
    totalAmount: trSubtotal + exSubtotal,
    transportation: {
      items: transportItems,
      subtotal: trSubtotal,
    },
    expenses: {
      items: expenseItems,
      subtotal: exSubtotal,
    },
    notes: notes || '※ 領収書原本は本紙に添付して経理担当者へ提出してください。',
  };
}