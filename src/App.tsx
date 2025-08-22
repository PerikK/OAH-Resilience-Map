import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ResilienceMap } from './components/ResilienceMap'
import { SelectionProvider } from './context/SelectionContext'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#f8fafc',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SelectionProvider>
        <ResilienceMap />
      </SelectionProvider>
    </ThemeProvider>
  )
}

export default App
