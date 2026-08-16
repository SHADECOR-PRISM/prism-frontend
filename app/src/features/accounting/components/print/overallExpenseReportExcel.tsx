import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type {
  ExpenseReportData,
  TransportReportItem,
  ExpenseReportItem,
} from '../../types/reportTypes';

// 全体明細用にユーザー名プロパティを持てるよう型を拡張
type OverallTransportReportItem = TransportReportItem & {
  userName?: string;
  applicantName?: string;
  userId?: string;
};

type OverallExpenseReportItem = ExpenseReportItem & {
  userName?: string;
  applicantName?: string;
  userId?: string;
};

export async function exportOverallExpenseReportExcel(data: ExpenseReportData): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('全体支出明細書', {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1, // 横幅は1ページに収める
      fitToHeight: 0, // 縦はページ数に応じて自然に改ページ
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.6,
        bottom: 0.6,
        header: 0.3,
        footer: 0.3,
      },
      showGridLines: true,
    },
  });

  // A〜G列の幅設定（合計100: A4縦印刷にジャストフィット）
  worksheet.columns = [
    { key: 'colA', width: 11 }, // 利用日
    { key: 'colB', width: 13 }, // 申請者（氏名）
    { key: 'colC', width: 16 }, // プロジェクト名
    { key: 'colD', width: 13 }, // 交通機関 / 勘定科目
    { key: 'colE', width: 23 }, // 利用区間 / 利用目的・備考（経費時はE〜F結合）
    { key: 'colF', width: 11 }, // 往復・片道 (交通費)
    { key: 'colG', width: 13 }, // 金額
  ];

  const FONT_FAMILY = 'Meiryo';
  const borderThin: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
    bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
    left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
    right: { style: 'thin', color: { argb: 'FFBFBFBF' } },
  };

  // ==========================================
  // 1. タイトル
  // ==========================================
  worksheet.mergeCells('A1:G2');
  const title = worksheet.getCell('A1');
  title.value = '全体支出明細書';
  title.font = { name: FONT_FAMILY, size: 16, bold: true, color: { argb: 'FF1F2328' } };
  title.alignment = { vertical: 'middle', horizontal: 'left' };
  worksheet.getRow(1).height = 18;
  worksheet.getRow(2).height = 24;

  // ==========================================
  // 2. 申請基本情報 & 合計金額
  // ==========================================
  worksheet.getRow(4).height = 18;
  worksheet.getRow(5).height = 22;

  worksheet.getCell('A4').value = '対象期間:';
  worksheet.getCell('A4').font = { name: FONT_FAMILY, size: 9, bold: true, color: { argb: 'FF666666' } };
  worksheet.mergeCells('B4:D4');
  worksheet.getCell('B4').value = `${data.period.start} 〜 ${data.period.end}`;
  worksheet.getCell('B4').font = { name: FONT_FAMILY, size: 9, bold: true };

  worksheet.getCell('E4').value = '出力日:';
  worksheet.getCell('E4').font = { name: FONT_FAMILY, size: 9, color: { argb: 'FF666666' } };
  worksheet.getCell('E4').alignment = { horizontal: 'right' };
  worksheet.mergeCells('F4:G4');
  worksheet.getCell('F4').value = data.exportDate;
  worksheet.getCell('F4').font = { name: FONT_FAMILY, size: 9 };
  worksheet.getCell('F4').alignment = { horizontal: 'right' };

  worksheet.getCell('A5').value = '対象伝票:';
  worksheet.getCell('A5').font = { name: FONT_FAMILY, size: 9, bold: true, color: { argb: 'FF666666' } };
  worksheet.mergeCells('B5:D5');
  worksheet.getCell('B5').value = `全メンバー合計 (${data.transportation.items.length + data.expenses.items.length}件)`;
  worksheet.getCell('B5').font = { name: FONT_FAMILY, size: 10, bold: true };

  worksheet.getCell('E5').value = '支出合計金額:';
  worksheet.getCell('E5').font = { name: FONT_FAMILY, size: 10, bold: true };
  worksheet.getCell('E5').alignment = { vertical: 'middle', horizontal: 'right' };

  worksheet.mergeCells('F5:G5');
  const totalCell = worksheet.getCell('F5');
  totalCell.value = data.totalAmount;
  totalCell.numFmt = '¥#,##0';
  totalCell.font = { name: FONT_FAMILY, size: 13, bold: true, color: { argb: 'FF0056B3' } };
  totalCell.alignment = { vertical: 'middle', horizontal: 'right' };
  totalCell.border = {
    bottom: { style: 'double', color: { argb: 'FF0056B3' } },
  };

  let currentRow = 7;

  // ==========================================
  // 3. 交通費明細
  // ==========================================
  if (data.transportation.items.length > 0) {
    worksheet.getCell(`A${currentRow}`).value = '1. 交通費明細';
    worksheet.getCell(`A${currentRow}`).font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: 'FF1F2328' } };
    currentRow++;

    // ヘッダー行
    const rowH = worksheet.getRow(currentRow);
    rowH.height = 20;
    const headers = [
      { col: 'A', text: '利用日' },
      { col: 'B', text: '申請者' },
      { col: 'C', text: 'プロジェクト名' },
      { col: 'D', text: '交通機関' },
      { col: 'E', text: '利用区間' },
      { col: 'F', text: '往復/片道' },
      { col: 'G', text: '金額' },
    ];

    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
      const cell = worksheet.getCell(`${col}${currentRow}`);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9ECEF' } };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF495057' } },
        bottom: { style: 'thin', color: { argb: 'FF495057' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    headers.forEach(({ col, text }) => {
      const cell = worksheet.getCell(`${col}${currentRow}`);
      cell.value = text;
      cell.font = { name: FONT_FAMILY, size: 8.5, bold: true, color: { argb: 'FF333333' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    currentRow++;

    // 明細行
    (data.transportation.items as OverallTransportReportItem[]).forEach((item) => {
      const row = worksheet.getRow(currentRow);
      row.height = 18;

      row.getCell('A').value = item.usageDate;
      row.getCell('B').value = item.userName || item.applicantName || item.userId || '-';
      row.getCell('C').value = item.projectName;
      row.getCell('D').value = item.category;
      row.getCell('E').value = item.route;
      row.getCell('F').value = item.isRoundTrip ? '往復' : '片道';
      row.getCell('G').value = item.amount;

      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
        const c = row.getCell(col);
        c.font = { name: FONT_FAMILY, size: 8.5 };
        c.border = borderThin;
        c.alignment = { vertical: 'middle' };
      });

      row.getCell('A').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('B').alignment = { vertical: 'middle', horizontal: 'left' };
      row.getCell('D').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('F').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('G').alignment = { vertical: 'middle', horizontal: 'right' };
      row.getCell('G').numFmt = '¥#,##0';
      currentRow++;
    });

    // 交通費小計
    worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
    const subLabel = worksheet.getCell(`A${currentRow}`);
    subLabel.value = '交通費 小計';
    subLabel.font = { name: FONT_FAMILY, size: 9, bold: true };
    subLabel.alignment = { vertical: 'middle', horizontal: 'right' };

    const subVal = worksheet.getCell(`G${currentRow}`);
    subVal.value = data.transportation.subtotal;
    subVal.font = { name: FONT_FAMILY, size: 9, bold: true };
    subVal.alignment = { vertical: 'middle', horizontal: 'right' };
    subVal.numFmt = '¥#,##0';

    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
      worksheet.getCell(`${col}${currentRow}`).border = {
        top: { style: 'thin', color: { argb: 'FF888888' } },
        bottom: { style: 'thin', color: { argb: 'FF888888' } },
      };
      worksheet.getCell(`${col}${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8F9FA' },
      };
    });
    currentRow += 2;
  }

  // ==========================================
  // 4. 経費明細
  // ==========================================
  if (data.expenses.items.length > 0) {
    worksheet.getCell(`A${currentRow}`).value = '2. 経費明細';
    worksheet.getCell(`A${currentRow}`).font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: 'FF1F2328' } };
    currentRow++;

    // ヘッダー行
    const rowH = worksheet.getRow(currentRow);
    rowH.height = 20;
    worksheet.mergeCells(`E${currentRow}:F${currentRow}`);

    const expHeaders = [
      { col: 'A', text: '利用日' },
      { col: 'B', text: '申請者' },
      { col: 'C', text: 'プロジェクト名' },
      { col: 'D', text: '勘定科目' },
      { col: 'E', text: '利用目的・備考' },
      { col: 'G', text: '金額' },
    ];

    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
      const cell = worksheet.getCell(`${col}${currentRow}`);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9ECEF' } };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF495057' } },
        bottom: { style: 'thin', color: { argb: 'FF495057' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    expHeaders.forEach(({ col, text }) => {
      const cell = worksheet.getCell(`${col}${currentRow}`);
      cell.value = text;
      cell.font = { name: FONT_FAMILY, size: 8.5, bold: true, color: { argb: 'FF333333' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    currentRow++;

    // 明細行
    (data.expenses.items as OverallExpenseReportItem[]).forEach((item) => {
      worksheet.mergeCells(`E${currentRow}:F${currentRow}`);
      const row = worksheet.getRow(currentRow);
      row.height = 18;

      row.getCell('A').value = item.usageDate;
      row.getCell('B').value = item.userName || item.applicantName || item.userId || '-';
      row.getCell('C').value = item.projectName;
      row.getCell('D').value = item.category;
      row.getCell('E').value = item.remark;
      row.getCell('G').value = item.amount;

      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
        const c = row.getCell(col);
        c.font = { name: FONT_FAMILY, size: 8.5 };
        c.border = borderThin;
        c.alignment = { vertical: 'middle' };
      });

      row.getCell('A').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('B').alignment = { vertical: 'middle', horizontal: 'left' };
      row.getCell('D').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('G').alignment = { vertical: 'middle', horizontal: 'right' };
      row.getCell('G').numFmt = '¥#,##0';
      currentRow++;
    });

    // 経費小計
    worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
    const subLabel = worksheet.getCell(`A${currentRow}`);
    subLabel.value = '経費 小計';
    subLabel.font = { name: FONT_FAMILY, size: 9, bold: true };
    subLabel.alignment = { vertical: 'middle', horizontal: 'right' };

    const subVal = worksheet.getCell(`G${currentRow}`);
    subVal.value = data.expenses.subtotal;
    subVal.font = { name: FONT_FAMILY, size: 9, bold: true };
    subVal.alignment = { vertical: 'middle', horizontal: 'right' };
    subVal.numFmt = '¥#,##0';

    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
      worksheet.getCell(`${col}${currentRow}`).border = {
        top: { style: 'thin', color: { argb: 'FF888888' } },
        bottom: { style: 'thin', color: { argb: 'FF888888' } },
      };
      worksheet.getCell(`${col}${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8F9FA' },
      };
    });
    currentRow += 2;
  }

  // ==========================================
  // 5. 備考欄
  // ==========================================
  if (data.notes) {
    worksheet.getCell(`A${currentRow}`).value = '■ 備考・特記事項';
    worksheet.getCell(`A${currentRow}`).font = { name: FONT_FAMILY, size: 9.5, bold: true, color: { argb: 'FF555555' } };
    currentRow++;

    worksheet.mergeCells(`A${currentRow}:G${currentRow + 2}`);
    const notesCell = worksheet.getCell(`A${currentRow}`);
    notesCell.value = data.notes;
    notesCell.font = { name: FONT_FAMILY, size: 8.5, color: { argb: 'FF333333' } };
    notesCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

    for (let r = currentRow; r <= currentRow + 2; r++) {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
        worksheet.getCell(`${col}${r}`).border = {
          top: r === currentRow ? { style: 'thin', color: { argb: 'FFCCCCCC' } } : undefined,
          bottom: r === currentRow + 2 ? { style: 'thin', color: { argb: 'FFCCCCCC' } } : undefined,
          left: col === 'A' ? { style: 'thin', color: { argb: 'FFCCCCCC' } } : undefined,
          right: col === 'G' ? { style: 'thin', color: { argb: 'FFCCCCCC' } } : undefined,
        };
        worksheet.getCell(`${col}${r}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFCFDFD' },
        };
      });
    }
    currentRow += 3;
  }

  // ==========================================
  // 6. 印刷範囲設定
  // ==========================================
  worksheet.pageSetup.printArea = `A1:G${currentRow}`;

  // Excelファイルのバイナリ生成・ダウンロード
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const safeStart = data.period.start.replace(/\//g, '');
  const safeEnd = data.period.end.replace(/\//g, '');
  const fileName = `全体支出明細_${safeStart}-${safeEnd}.xlsx`;
  saveAs(blob, fileName);
}