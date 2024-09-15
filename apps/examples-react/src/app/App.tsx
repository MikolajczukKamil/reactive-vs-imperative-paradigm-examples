import { Box, Container, useTheme, createTheme, Tab, Tabs, ThemeProvider } from '@mui/material';
import {
  plPL
}                                                                          from '@mui/material/locale';
import { useMemo }                                               from 'react';

import { ListWithFilters } from './list-with-filters';

export function App() {
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, plPL),
    [ theme ]
  );
  
  return (
    <ThemeProvider theme={ themeWithLocale }>
      <Tabs sx={ { maxWidth: 1000, width: '100%', margin: 'auto' } }
      >
        <Tab
          sx={ { flex: 1, maxWidth: 1000 } }
          label="Lista z filtrami"
        />
        <Tab
          sx={ { flex: 1, maxWidth: 1000 } }
          label="Inny przykład"
        />
      </Tabs>
      
      <Container maxWidth="xl">
        <Box sx={ { p: 3 } }>
          <ListWithFilters />
          <p>Tab2</p>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
