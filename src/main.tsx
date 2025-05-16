import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AttackerTransferList from './AttackerTransferList';
import DefenderTransferList from './DefenderTransferList';
import {
  Box,
  Card,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { theme } from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" width="100vw">
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ height: '100%', py: 4 }}
        >
          <Typography variant="h4" component="h1" textAlign="center">
            Random Operator Generator
          </Typography>
          <Stack
            direction="row"
            spacing={10}
            justifyContent="center"
            alignItems="center"
          >
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <AttackerTransferList />
            </Card>
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <DefenderTransferList />
            </Card>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  </StrictMode>
);
