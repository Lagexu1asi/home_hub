import { useEffect, type ReactNode } from 'react'

interface SheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/**
 * 底部弹出面板 —— 用于添加/编辑项
 * 点击遮罩或按 Esc 关闭
 */
export default function Sheet({ open, title, onClose, children }: SheetProps) {
  // Esc 关闭
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" />
      {/* 面板 */}
      <div
        className="relative w-full max-w-xl rounded-t-2xl bg-card p-4 shadow-xl"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink text-xl leading-none"
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
