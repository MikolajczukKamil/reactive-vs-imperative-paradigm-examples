import { Box, Container, createTheme, Tab, Tabs, ThemeProvider, useTheme } from '@mui/material'
import {
  plPL,
}                                                                          from '@mui/material/locale'
import { useMemo, useState }                                               from 'react'

import { ListWithFilters } from '../list-with-filters'
import { SomePage }        from '../some-page'


export enum RoutesMap {
  ListWithFilters,
  SomePage,
}

export function App() {
  const [ path, setPath ] = useState(RoutesMap.ListWithFilters)
  
  function goTo(_: unknown, newPage: RoutesMap) {
    setPath(newPage)
  }
  
  const theme = useTheme()
  const themeWithLocale = useMemo(
    () => createTheme(theme, plPL),
    [ theme ],
  )
  
  return (
    <ThemeProvider theme={ themeWithLocale }>
      <Tabs value={ path } onChange={ goTo } centered>
        <Tab label="Lista z filtrami" value={ RoutesMap.ListWithFilters } />
        <Tab label="Inny przykład" value={ RoutesMap.SomePage } />
      </Tabs>
      
      <Container maxWidth="xl">
        <Box sx={ { p: 3 } }>
          { path === RoutesMap.ListWithFilters && <ListWithFilters /> }
          { path === RoutesMap.SomePage && <SomePage /> }
        </Box>
      </Container>
    </ThemeProvider>
  )
}
