import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificationContext'
import { LoginContextProvider } from './LoginContext'
import { BrowserRouter as Router } from 'react-router-dom'
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <LoginContextProvider>
        <NotificationContextProvider>
          <App/>
        </NotificationContextProvider>
      </LoginContextProvider>
    </QueryClientProvider>
  </Router>
)

