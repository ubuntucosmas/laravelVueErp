import { ref } from 'vue'

export function useModalManagement() {
  const showMaterialsModal = ref(false)
  const showBudgetModal = ref(false)
  const showQuoteModal = ref(false)
  const showQuotationViewer = ref(false)
  const showSiteSurveyModal = ref(false)

  const openMaterialsModal = () => {
    showMaterialsModal.value = true
  }

  const openBudgetModal = () => {
    showBudgetModal.value = true
  }

  const openQuoteModal = () => {
    showQuoteModal.value = true
  }

  const openQuotationViewer = () => {
    showQuotationViewer.value = true
  }

  const openSiteSurveyModal = () => {
    showSiteSurveyModal.value = true
  }

  const closeMaterialsModal = () => {
    showMaterialsModal.value = false
  }

  const closeBudgetModal = () => {
    showBudgetModal.value = false
  }

  const closeQuoteModal = () => {
    showQuoteModal.value = false
  }

  const closeQuotationViewer = () => {
    showQuotationViewer.value = false
  }

  const closeSiteSurveyModal = () => {
    showSiteSurveyModal.value = false
  }

  return {
    showMaterialsModal,
    showBudgetModal,
    showQuoteModal,
    showQuotationViewer,
    showSiteSurveyModal,
    openMaterialsModal,
    openBudgetModal,
    openQuoteModal,
    openQuotationViewer,
    openSiteSurveyModal,
    closeMaterialsModal,
    closeBudgetModal,
    closeQuoteModal,
    closeQuotationViewer,
    closeSiteSurveyModal
  }
}
