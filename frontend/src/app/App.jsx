import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/app/store'
import { AppRoutes } from '@/routes/AppRoutes'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ToastProvider } from '@/components/ui/toast'
import { useTheme } from '@/hooks/useTheme'

function AppContent() {
  useTheme()
  return (
    <ErrorBoundary>
      <AppRoutes />
      <ToastProvider />
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  )
}
