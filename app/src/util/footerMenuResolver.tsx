import type { ReactNode } from 'react'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ApprovalIcon from '@mui/icons-material/Approval'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'

// ナビゲーションアイテムの型定義
export interface NavItem {
  value: string
  icon: ReactNode
  label?: string
}

// 役割（Role）と ドメイン領域（Domain）の型定義
export type UserRole = 'general' | 'admin'
export type DomainCategory =  'accounting' 
// | 'equipment' 将来的な拡張に対応

export interface NavMenuOptions {
  role: UserRole
  domain?: DomainCategory
}

// 1. 各メニューの固定定義
const GENERAL_ACCOUNTING_NAV: NavItem[] = [
  { value: '/general/log', icon: <ReceiptLongIcon /> },
  { value: '/general/application', icon: <EditDocumentIcon /> },
  { value: '/general/setting', icon: <SettingsOutlinedIcon /> },
]

const ADMIN_ACCOUNTING_NAV: NavItem[] = [
  { value: '/admin/approval', icon: <ApprovalIcon /> },
  { value: '/admin/print', icon: <LocalPrintshopOutlinedIcon /> },
  { value: '/admin/analytics', icon: <AssessmentOutlinedIcon /> },
]

// 2. 引数に応じて最適な NavItem[] を選択して返すファクトリー関数
export function getNavItems({ role, domain = 'accounting' }: NavMenuOptions): NavItem[] {
  // 将来的には domain での条件分岐（equipment 等）をここに追加可能
  if (domain === 'accounting') {
    switch (role) {
      case 'admin':
        return ADMIN_ACCOUNTING_NAV
      case 'general':
      default:
        return GENERAL_ACCOUNTING_NAV
    }
  }

  // デフォルトフォールバック
  return GENERAL_ACCOUNTING_NAV
}