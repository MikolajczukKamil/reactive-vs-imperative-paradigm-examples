import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppBar, Tab, Tabs, Box, Container } from '@mui/material';
import { SyntheticEvent } from 'react';

import { SomePage } from '../some-page';
import { RoutesMap } from './roates';
import { ListWithFilters } from '../list-with-filters';

export function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.replace(/^\//, '')

  function goTo(event: SyntheticEvent, newPage: RoutesMap) {
    navigate(newPage)
  }

  return (
    <>
      <Box sx={{bgcolor: 'background.paper'}}>
        <AppBar position="static" color="default">
          <Tabs value={path} onChange={goTo} centered>
            <Tab label="Lista z filtrami" value={RoutesMap.ListWithFilters}/>
            <Tab label="Inny przykład" value={RoutesMap.SomePage}/>
          </Tabs>
        </AppBar>
      </Box>

      <Container maxWidth="xl">
        <Box sx={{p: 3}}>
          <Routes>
            <Route path="/" element={<Navigate to={RoutesMap.ListWithFilters}/>}/>

            <Route
              path={RoutesMap.ListWithFilters}
              element={<ListWithFilters/>}
            />

            <Route
              path={RoutesMap.SomePage}
              element={<SomePage/>}
            />
          </Routes>
        </Box>
      </Container>
    </>
  );
}
