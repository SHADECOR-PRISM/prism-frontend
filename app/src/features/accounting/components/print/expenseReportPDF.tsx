import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { ExpenseReportData } from '../../types/reportTypes';

// 日本語フォント (Noto Sans JP) の登録
Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75vY0rw-oME.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFJEj75vY0rw-oME.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: 'NotoSansJP',
    fontSize: 9,
    color: '#222222',
  },
  // ヘッダー部
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 9,
    color: '#555555',
    width: 65,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 'normal',
  },
  totalAmountBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#F5F7FA',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D0D7DE',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  totalAmountLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2328',
  },
  totalAmountValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0969DA',
  },
  // 押印欄
  stampTable: {
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
  },
  stampColumn: {
    width: 48,
    borderRightWidth: 1,
    borderColor: '#333333',
  },
  stampColumnLast: {
    width: 48,
  },
  stampHeader: {
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderColor: '#333333',
    paddingVertical: 3,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 'bold',
  },
  stampBody: {
    height: 48,
  },
  // セクション
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1F2328',
  },
  // テーブル共通
  table: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E1E4E8',
    minHeight: 20,
    alignItems: 'center',
  },
  tableRowHeader: {
    backgroundColor: '#F6F8FA',
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#444444',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tableCell: {
    fontSize: 8,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  // 交通費テーブル列幅
  colTrDate: { width: '15%' },
  colTrProject: { width: '22%' },
  colTrCategory: { width: '13%' },
  colTrRoute: { width: '28%' },
  colTrRound: { width: '10%' },
  colTrAmount: { width: '12%' },
  // 経費テーブル列幅
  colExDate: { width: '15%' },
  colExProject: { width: '22%' },
  colExCategory: { width: '18%' },
  colExRemark: { width: '33%' },
  colExAmount: { width: '12%' },
  // 小計行
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 6,
    gap: 8,
  },
  subtotalLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#555555',
  },
  subtotalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2328',
  },
  // 備考欄
  notesBox: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 2,
    padding: 8,
    minHeight: 40,
  },
  notesText: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.4,
  },
  // フッター
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 24,
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
        {/* ヘッダーエリア */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>経 費 ・ 交 通 費 精 算 書</Text>
          <View style={styles.headerRow}>
            {/* 左側：申請者情報 & 総合計額 */}
            <View style={styles.metaLeft}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>申請者氏名 :</Text>
                <Text style={styles.metaValue}>
                  {data.applicant.name} (ID: {data.applicant.userId})
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>作 成 日 :</Text>
                <Text style={styles.metaValue}>{data.exportDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>対象期間 :</Text>
                <Text style={styles.metaValue}>
                  {data.period.start} 〜 {data.period.end}
                </Text>
              </View>

              <View style={styles.totalAmountBox}>
                <Text style={styles.totalAmountLabel}>精算合計金額 :</Text>
                <Text style={styles.totalAmountValue}>
                  ¥ {data.totalAmount.toLocaleString()} -
                </Text>
              </View>
            </View>

            {/* 右側：承認押印欄（経理・副代表・代表） */}
            <View style={styles.stampTable}>
              <View style={styles.stampColumn}>
                <Text style={styles.stampHeader}>経理</Text>
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
        </View>

        {/* 1. 交通費明細セクション */}
        {data.transportation.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>■ 1. 交通費明細</Text>
            <View style={styles.table}>
              {/* テーブルヘッダー */}
              <View style={[styles.tableRow, styles.tableRowHeader]}>
                <Text style={[styles.tableCellHeader, styles.colTrDate, styles.textCenter]}>利用日</Text>
                <Text style={[styles.tableCellHeader, styles.colTrProject]}>プロジェクト</Text>
                <Text style={[styles.tableCellHeader, styles.colTrCategory, styles.textCenter]}>手段</Text>
                <Text style={[styles.tableCellHeader, styles.colTrRoute]}>区間 (発〜着)</Text>
                <Text style={[styles.tableCellHeader, styles.colTrRound, styles.textCenter]}>往復</Text>
                <Text style={[styles.tableCellHeader, styles.colTrAmount, styles.textRight]}>金額(円)</Text>
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
                    {item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            {/* 小計 */}
            <View style={styles.subtotalRow} wrap={false}>
              <Text style={styles.subtotalLabel}>交通費小計 :</Text>
              <Text style={styles.subtotalValue}>
                ¥ {data.transportation.subtotal.toLocaleString()} -
              </Text>
            </View>
          </View>
        )}

        {/* 2. 経費明細セクション */}
        {data.expenses.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>■ 2. 経費明細</Text>
            <View style={styles.table}>
              {/* テーブルヘッダー */}
              <View style={[styles.tableRow, styles.tableRowHeader]}>
                <Text style={[styles.tableCellHeader, styles.colExDate, styles.textCenter]}>利用日</Text>
                <Text style={[styles.tableCellHeader, styles.colExProject]}>プロジェクト</Text>
                <Text style={[styles.tableCellHeader, styles.colExCategory]}>カテゴリ</Text>
                <Text style={[styles.tableCellHeader, styles.colExRemark]}>利用用途 (備考)</Text>
                <Text style={[styles.tableCellHeader, styles.colExAmount, styles.textRight]}>金額(円)</Text>
              </View>

              {/* 明細行 */}
              {data.expenses.items.map((item, idx) => (
                <View key={`ex-${idx}`} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCell, styles.colExDate, styles.textCenter]}>{item.usageDate}</Text>
                  <Text style={[styles.tableCell, styles.colExProject]}>{item.projectName}</Text>
                  <Text style={[styles.tableCell, styles.colExCategory]}>{item.category}</Text>
                  <Text style={[styles.tableCell, styles.colExRemark]}>{item.remark}</Text>
                  <Text style={[styles.tableCell, styles.colExAmount, styles.textRight]}>
                    {item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            {/* 小計 */}
            <View style={styles.subtotalRow} wrap={false}>
              <Text style={styles.subtotalLabel}>経費小計 :</Text>
              <Text style={styles.subtotalValue}>
                ¥ {data.expenses.subtotal.toLocaleString()} -
              </Text>
            </View>
          </View>
        )}

        {/* 3. 備考・連絡事項 */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>■ 3. 備考・連絡事項</Text>
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>
              {data.notes || '※ 領収書原本は本紙に添付して経理担当者へ提出してください。'}
            </Text>
          </View>
        </View>

        {/* ページ番号（フッター） */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}