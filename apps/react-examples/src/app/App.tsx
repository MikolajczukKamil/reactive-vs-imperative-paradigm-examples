import { Box, Container, Tab, Tabs } from '@mui/material'
import { useState }                  from 'react'

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
  
  return (
    <>
      <Tabs value={ path } onChange={ goTo } centered>
        <Tab label="Lista z filtrami" value={ RoutesMap.ListWithFilters } />
        <Tab label="Inny przykład" value={ RoutesMap.SomePage } />
      </Tabs>
      
      <Container maxWidth="xl">
        <Box sx={ { p: 3 } }>
          { path === RoutesMap.ListWithFilters && <SomePage /> }
          { path === RoutesMap.SomePage && <ListWithFilters /> }
        </Box>
      </Container>
    </>
  )
}
