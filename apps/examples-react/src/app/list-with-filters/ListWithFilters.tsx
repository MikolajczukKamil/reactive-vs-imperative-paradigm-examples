import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField
}                 from '@mui/material';


export function ListWithFilters() {
  return (
    <Box>
      <Card />
      
      <InputAdornment position="end" />
      <SearchIcon />
      <TextField />
      
      <FormControl />
      <InputLabel />
      <MenuItem />
      <Select />
      
      <Button />
      
      <Paper>
        <TableContainer>
          <Table>
            <TableHead />
            <TableRow />
            <TableCell />
            <TableSortLabel />
            
            <TableBody />
          </Table>
        </TableContainer>
        <LinearProgress />
        
        <TablePagination count={ 1 } onPageChange={ () => { /**/ } } page={ 1 } rowsPerPage={ 1 } />
      </Paper>
    </Box>
  );
}
