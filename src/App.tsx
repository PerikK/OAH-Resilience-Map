import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ResilienceMap } from './components/ResilienceMap'
import { SelectionProvider } from './context/SelectionContext'
import { ThemeProvider } from './context/ThemeContext'
import { queryClient } from './lib/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SelectionProvider>
          <ResilienceMap />
        </SelectionProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
