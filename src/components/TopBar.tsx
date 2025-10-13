import { Box } from '@mui/material'
import top_left_logo from '../assets/top_left_logo.svg'

export function TopBar() {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        height: '60px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <img src={top_left_logo} alt="Logo" style={{ height: '36px' }} />
    </Box>
  )
}
