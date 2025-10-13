import { ResilienceMap } from './components/ResilienceMap'
import { SelectionProvider } from './context/SelectionContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <SelectionProvider>
        <ResilienceMap />
      </SelectionProvider>
    </ThemeProvider>
  )
}

export default App
