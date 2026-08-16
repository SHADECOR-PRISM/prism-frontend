import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { ExpenseReportData } from '../../types/reportTypes';

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
  // 1. ヘッダー（タイトル & 押印欄）
  // ==========================================
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2328',
    marginTop: 10,
  },
  // 押印枠（均等幅 & 正方形比率）
  stampTable: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#777777',
  },
  stampColumn: {
    width: 48,
    borderRightWidth: 1,
    borderColor: '#777777',
  },
  stampColumnLast: {
    width: 48,
  },
  stampHeader: {
    backgroundColor: '#F2F4F7',
    borderBottomWidth: 1,
    borderColor: '#777777',
    paddingVertical: 3,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#555555',
  },
  stampBody: {
    height: 48, // 48x48 の正方形
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

  // 交通費列幅（Excelの幅比率 12 : 16 : 13 : 23 : 12 : 24 に対応）
  colTrDate: { width: '12%' },
  colTrProject: { width: '16%' },
  colTrCategory: { width: '13%' },
  colTrRoute: { width: '27%' },
  colTrRound: { width: '10%' },
  colTrAmount: { width: '22%' },

  // 経費列幅（Excelの幅比率 12 : 16 : 13 : 35 : 24 に対応）
  colExDate: { width: '12%' },
  colExProject: { width: '16%' },
  colExCategory: { width: '13%' },
  colExRemark: { width: '37%' },
  colExAmount: { width: '22%' },

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

interface ExpenseReportPDFProps {
  data: ExpenseReportData;
}

export default function ExpenseReportPDF({ data }: ExpenseReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 1. タイトル & 押印欄 */}
        <View style={styles.topHeaderRow}>
          <Text style={styles.title}>経費・交通費精算書</Text>

          {/* 押印枠（会計・副代表・代表） */}
          <View style={styles.stampTable}>
            <View style={styles.stampColumn}>
              <Text style={styles.stampHeader}>会計</Text>
              <View style={styles.stampBody} />
            </View>
            <View style={styles.stampColumn}>
              <Text style={styles.stampHeader}>副代表</Text>
              <View style={styles.stampBody} />
            </View>
            <View style={styles.stampColumnLast}>
              <Text style={styles.stampHeader}>代表</Text>
              <View style={styles.stampBody} />
            </View>
          </View>
        </View>

        {/* 2. 基本情報 & 精算合計金額 */}
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
              <Text style={styles.infoLabel}>申請者 :</Text>
              <Text style={styles.applicantValue}>
                {data.applicant.name} ({data.applicant.userId})
              </Text>
            </View>
            <View style={styles.infoItemRight}>
              <Text style={styles.totalAmountLabel}>精算合計金額 :</Text>
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
                <Text style={[styles.tableCellHeader, styles.colTrProject]}>プロジェクト名</Text>
                <Text style={[styles.tableCellHeader, styles.colTrCategory, styles.textCenter]}>交通機関</Text>
                <Text style={[styles.tableCellHeader, styles.colTrRoute]}>利用区間</Text>
                <Text style={[styles.tableCellHeader, styles.colTrRound, styles.textCenter]}>往復/片道</Text>
                <Text style={[styles.tableCellHeader, styles.colTrAmount, styles.textRight]}>金額</Text>
              </View>

              {/* 明細行（自動改ページ対応） */}
              {data.transportation.items.map((item, idx) => (
                <View key={`tr-${idx}`} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCell, styles.colTrDate, styles.textCenter]}>{item.usageDate}</Text>
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
                <Text style={[styles.subtotalLabelCell, { width: '78%' }]}>交通費 小計</Text>
                <Text style={[styles.subtotalValueCell, { width: '22%' }]}>
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
                <Text style={[styles.tableCellHeader, styles.colExProject]}>プロジェクト名</Text>
                <Text style={[styles.tableCellHeader, styles.colExCategory, styles.textCenter]}>勘定科目</Text>
                <Text style={[styles.tableCellHeader, styles.colExRemark]}>利用目的・備考</Text>
                <Text style={[styles.tableCellHeader, styles.colExAmount, styles.textRight]}>金額</Text>
              </View>

              {/* 明細行 */}
              {data.expenses.items.map((item, idx) => (
                <View key={`ex-${idx}`} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCell, styles.colExDate, styles.textCenter]}>{item.usageDate}</Text>
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
                <Text style={[styles.subtotalLabelCell, { width: '78%' }]}>経費 小計</Text>
                <Text style={[styles.subtotalValueCell, { width: '22%' }]}>
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