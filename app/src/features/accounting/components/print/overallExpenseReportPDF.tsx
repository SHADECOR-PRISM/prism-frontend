import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type {
  ExpenseReportData,
  TransportReportItem,
  ExpenseReportItem,
} from '../../types/reportTypes';

// フォント読み込み
import notoSansRegular from '../../../../assets/fonts/NotoSansJP-Regular.ttf';
import notoSansBold from '../../../../assets/fonts/NotoSansJP-Bold.ttf';

Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: notoSansRegular,
      fontWeight: 'normal',
    },
    {
      src: notoSansBold,
      fontWeight: 'bold',
    },
  ],
});

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

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontFamily: 'NotoSansJP',
    fontSize: 8.5,
    color: '#1F2328',
  },

  // ==========================================
  // 1. ヘッダー（タイトル: 押印欄なし）
  // ==========================================
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2328',
  },

  // ==========================================
  // 2. 申請基本情報 & 合計金額
  // ==========================================
  infoGrid: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
    paddingBottom: 10,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  infoLabel: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#666666',
    width: 55,
  },
  infoValue: {
    fontSize: 9,
    fontWeight: 'normal',
    color: '#1F2328',
  },
  applicantValue: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#1F2328',
  },
  totalAmountLabel: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#1F2328',
    marginRight: 6,
  },
  totalAmountValue: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#0056B3',
    borderBottomWidth: 2,
    borderColor: '#0056B3',
    paddingBottom: 1,
  },

  // ==========================================
  // 3. セクション共通
  // ==========================================
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F2328',
  },

  // テーブル共通
  table: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1.5,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    borderTopColor: '#495057',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 18,
    alignItems: 'center',
  },
  tableRowHeader: {
    backgroundColor: '#E9ECEF',
    borderBottomWidth: 1,
    borderBottomColor: '#495057',
    minHeight: 19,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  tableCell: {
    fontSize: 8,
    color: '#1F2328',
    paddingHorizontal: 4,
    paddingVertical: 2.5,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },

  // 交通費列幅（Excelの幅比率 11 : 13 : 16 : 13 : 23 : 11 : 13 に対応）
  colTrDate: { width: '11%' },
  colTrUser: { width: '13%' },
  colTrProject: { width: '16%' },
  colTrCategory: { width: '13%' },
  colTrRoute: { width: '23%' },
  colTrRound: { width: '11%' },
  colTrAmount: { width: '13%' },

  // 経費列幅（Excelの幅比率 11 : 13 : 16 : 13 : 34 : 13 に対応）
  colExDate: { width: '11%' },
  colExUser: { width: '13%' },
  colExProject: { width: '16%' },
  colExCategory: { width: '13%' },
  colExRemark: { width: '34%' },
  colExAmount: { width: '13%' },

  // テーブル内小計行
  tableRowSubtotal: {
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#888888',
    minHeight: 18,
  },
  subtotalLabelCell: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#1F2328',
    paddingRight: 8,
    textAlign: 'right',
  },
  subtotalValueCell: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#1F2328',
    paddingHorizontal: 4,
    textAlign: 'right',
  },

  // ==========================================
  // 4. 備考欄
  // ==========================================
  notesBox: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FCFDFD',
    borderRadius: 2,
    padding: 6,
    minHeight: 38,
  },
  notesText: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.4,
  },

  // ==========================================
  // 5. フッター（ページ番号）
  // ==========================================
  pageNumber: {
    position: 'absolute',
    fontSize: 7.5,
    bottom: 18,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888888',
  },
});

interface OverallExpenseReportPDFProps {
  data: ExpenseReportData;
}

export default function OverallExpenseReportPDF({ data }: OverallExpenseReportPDFProps) {
  const totalItemCount = data.transportation.items.length + data.expenses.items.length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 1. タイトル（押印枠なし） */}
        <View style={styles.topHeaderRow}>
          <Text style={styles.title}>全体支出明細書</Text>
        </View>

        {/* 2. 基本情報 & 支出合計金額 */}
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <View style={styles.infoItemLeft}>
              <Text style={styles.infoLabel}>対象期間 :</Text>
              <Text style={styles.infoValue}>
                {data.period.start} 〜 {data.period.end}
              </Text>
            </View>
            <View style={styles.infoItemRight}>
              <Text style={styles.infoLabel}>出力日 :</Text>
              <Text style={styles.infoValue}>{data.exportDate}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItemLeft}>
              <Text style={styles.infoLabel}>対象伝票 :</Text>
              <Text style={styles.applicantValue}>
                全メンバー合計 ({totalItemCount}件)
              </Text>
            </View>
            <View style={styles.infoItemRight}>
              <Text style={styles.totalAmountLabel}>支出合計金額 :</Text>
              <Text style={styles.totalAmountValue}>
                ¥{data.totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. 交通費明細セクション */}
        {data.transportation.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. 交通費明細</Text>
            <View style={styles.table}>
              {/* テーブルヘッダー */}
              <View style={[styles.tableRow, styles.tableRowHeader]}>
                <Text style={[styles.tableCellHeader, styles.colTrDate, styles.textCenter]}>利用日</Text>
                <Text style={[styles.tableCellHeader, styles.colTrUser]}>申請者</Text>
                <Text style={[styles.tableCellHeader, styles.colTrProject]}>プロジェクト名</Text>
                <Text style={[styles.tableCellHeader, styles.colTrCategory, styles.textCenter]}>交通機関</Text>
                <Text style={[styles.tableCellHeader, styles.colTrRoute]}>利用区間</Text>
                <Text style={[styles.tableCellHeader, styles.colTrRound, styles.textCenter]}>往復/片道</Text>
                <Text style={[styles.tableCellHeader, styles.colTrAmount, styles.textRight]}>金額</Text>
              </View>

              {/* 明細行 */}
              {(data.transportation.items as OverallTransportReportItem[]).map((item, idx) => (
                <View key={`tr-${idx}`} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCell, styles.colTrDate, styles.textCenter]}>{item.usageDate}</Text>
                  <Text style={[styles.tableCell, styles.colTrUser]}>
                    {item.userName || item.applicantName || item.userId || '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colTrProject]}>{item.projectName}</Text>
                  <Text style={[styles.tableCell, styles.colTrCategory, styles.textCenter]}>{item.category}</Text>
                  <Text style={[styles.tableCell, styles.colTrRoute]}>{item.route}</Text>
                  <Text style={[styles.tableCell, styles.colTrRound, styles.textCenter]}>
                    {item.isRoundTrip ? '往復' : '片道'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colTrAmount, styles.textRight]}>
                    ¥{item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}

              {/* 交通費小計行 */}
              <View style={[styles.tableRow, styles.tableRowSubtotal]} wrap={false}>
                <Text style={[styles.subtotalLabelCell, { width: '87%' }]}>交通費 小計</Text>
                <Text style={[styles.subtotalValueCell, { width: '13%' }]}>
                  ¥{data.transportation.subtotal.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 4. 経費明細セクション */}
        {data.expenses.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. 経費明細</Text>
            <View style={styles.table}>
              {/* テーブルヘッダー */}
              <View style={[styles.tableRow, styles.tableRowHeader]}>
                <Text style={[styles.tableCellHeader, styles.colExDate, styles.textCenter]}>利用日</Text>
                <Text style={[styles.tableCellHeader, styles.colExUser]}>申請者</Text>
                <Text style={[styles.tableCellHeader, styles.colExProject]}>プロジェクト名</Text>
                <Text style={[styles.tableCellHeader, styles.colExCategory, styles.textCenter]}>勘定科目</Text>
                <Text style={[styles.tableCellHeader, styles.colExRemark]}>利用目的・備考</Text>
                <Text style={[styles.tableCellHeader, styles.colExAmount, styles.textRight]}>金額</Text>
              </View>

              {/* 明細行 */}
              {(data.expenses.items as OverallExpenseReportItem[]).map((item, idx) => (
                <View key={`ex-${idx}`} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCell, styles.colExDate, styles.textCenter]}>{item.usageDate}</Text>
                  <Text style={[styles.tableCell, styles.colExUser]}>
                    {item.userName || item.applicantName || item.userId || '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colExProject]}>{item.projectName}</Text>
                  <Text style={[styles.tableCell, styles.colExCategory, styles.textCenter]}>{item.category}</Text>
                  <Text style={[styles.tableCell, styles.colExRemark]}>{item.remark}</Text>
                  <Text style={[styles.tableCell, styles.colExAmount, styles.textRight]}>
                    ¥{item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}

              {/* 経費小計行 */}
              <View style={[styles.tableRow, styles.tableRowSubtotal]} wrap={false}>
                <Text style={[styles.subtotalLabelCell, { width: '87%' }]}>経費 小計</Text>
                <Text style={[styles.subtotalValueCell, { width: '13%' }]}>
                  ¥{data.expenses.subtotal.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 5. 備考・特記事項 */}
        {data.notes ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>■ 備考・特記事項</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{data.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* 6. フッター（ページ番号） */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}