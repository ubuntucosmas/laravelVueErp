// src/composables/useConfirm.ts
// Minimal confirmation composable for production module and others
export function useConfirm() {
  const confirm = (
    title: string,
    message: string,
    confirmText = 'OK',
    cancelText = 'Cancel'
  ): Promise<boolean> => {
    // Use browser confirm for now
    return Promise.resolve(window.confirm(`${title}\n\n${message}`))
  }
  return { confirm }
}
