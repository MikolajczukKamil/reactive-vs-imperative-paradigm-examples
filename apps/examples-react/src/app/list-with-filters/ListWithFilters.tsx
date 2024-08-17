import SearchIcon                           from '@mui/icons-material/Search';
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
}                                           from '@mui/material';
import { SelectChangeEvent }                from '@mui/material/Select/SelectInput';
import { Etf }                              from '@org/common-lib';
import { ChangeEvent, useEffect, useState } from 'react';

import { useEtfsService } from './use-etfs';


interface Currency {
  code: string;
  name: string;
}

const pageSizes = [ 5, 10, 20, 50, 100 ];

const currencies: Currency[] = [
  { code: 'USD', name: 'Dolar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Funt' },
  { code: 'CHF', name: 'Frank' },
  { code: 'PLN', name: 'Złoty' }
];

const headCells = [
  {
    name: 'name',
    label: 'Nazwa'
  }, {
    name: 'price',
    label: 'Cena'
  }, {
    name: 'currency',
    label: 'Waluta'
  }
];

export function ListWithFilters() {
  const [ rows, setRows ] = useState<Etf[]>([]);
  const [ allItems, setAllItems ] = useState(0);
  const [ search, setSearch ] = useState('');
  const [ minPrice, setMinPrice ] = useState('');
  const [ maxPrice, setMaxPrice ] = useState('');
  const [ currency, setCurrency ] = useState('');
  const [ sortProperty, setSortProperty ] = useState<undefined | string>(undefined);
  const [ sortDirection, setSortDirection ] = useState<undefined | 'asc' | 'desc'>(undefined);
  const [ page, setPage ] = useState(0);
  const [ pageSize, setPageSize ] = useState(pageSizes[0]);
  const [ loading, setLoading ] = useState(false);
  
  const etfService = useEtfsService();
  
  function handleCurrencyChange(e: SelectChangeEvent<string>): void {
    setCurrency(e.target?.value ?? '');
  }
  
  function handleChangePage(_: unknown, newPage: number) {
    setPage(newPage);
  }
  
  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  }
  
  function handleClear(): void {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setCurrency('');
    setSortProperty(undefined);
    setSortDirection(undefined);
  }
  
  useEffect(() => {
    let isActive = true;
    
    setLoading(true);
    
    etfService
      .getEtfList(
        page + 1,
        pageSize,
        {
          search: search || null,
          priceMin: parseFloat(minPrice) || null,
          priceMax: parseFloat(maxPrice) || null,
          currency: currency || null
        },
        sortProperty,
        sortDirection
      )
      .then(page => {
        if (isActive) {
          console.log({ page })
          setRows(page.items);
          setAllItems(page.itemsCount);
        }
        
        setLoading(false);
      })
      .catch((e) => {
        console.log({ e })
        
        setLoading(false);
      });
    
    return () => { isActive = false; };
  }, [ etfService, page, pageSize, search, minPrice, maxPrice, currency, sortProperty, sortDirection ]);
  
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = pageSize - rows.length;
  
  function toggleSort(property: string) {
    const isAsc = sortProperty === property && sortDirection === 'asc';
    
    setSortProperty(property);
    setSortDirection(isAsc ? 'desc' : 'asc');
  }
  
  return (
    <Box sx={ { maxWidth: 1000, margin: 'auto' } }>
      <form>
        <Card
          sx={ {
            p: 2,
            mb: 2,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            '& > *': { flex: 1 }
          } }
        >
          <TextField
            label="Szukaj" variant="outlined" InputProps={ {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          } }
          />
          
          <TextField label="Cena minimalna" variant="outlined" type="number" />
          <TextField label="Cena maksymalna" variant="outlined" type="number" />
          
          <FormControl>
            <InputLabel>Waluta</InputLabel>
            
            <Select
              value={ currency || '' }
              label="Waluta"
              onChange={ handleCurrencyChange }
              sx={ { minWidth: 120 } }
            >
              { currencies.map(currency => (
                <MenuItem
                  key={ currency.code }
                  value={ currency.code }
                >{ currency.name }</MenuItem>)
              ) }
            </Select>
          </FormControl>
          
          <Button onClick={ handleClear }>Wyczyść i przeładuj</Button>
        </Card>
      </form>
      
      <Paper sx={ { width: '100%', mb: 2 } }>
        <TableContainer>
          <Table sx={ { minWidth: 750 } }>
            <TableHead>
              <TableRow>
                { headCells.map((headCell) => (
                  <TableCell
                    key={ headCell.name }
                    sortDirection={ sortProperty === headCell.name ? sortDirection : false }
                  >
                    <TableSortLabel
                      active={ sortProperty === headCell.name }
                      direction={ sortProperty === headCell.name && sortDirection === 'desc' ? 'desc' : 'asc' }
                      onClick={ () => toggleSort(headCell.name) }
                    >
                      { headCell.label }
                    </TableSortLabel>
                  </TableCell>
                )) }
              </TableRow>
            </TableHead>
            
            <TableBody>
              { rows.map((row) => (
                <TableRow hover role="checkbox" key={ row.name }>
                  <TableCell>{ row.name }</TableCell>
                  <TableCell>{ row.price }</TableCell>
                  <TableCell>{ row.currency }</TableCell>
                </TableRow>
              )) }
              { emptyRows > 0 && (
                <TableRow style={ { height: 53 * emptyRows } }>
                  <TableCell colSpan={ 3 } />
                </TableRow>
              ) }
            </TableBody>
          </Table>
        </TableContainer>
        
        { loading && <LinearProgress /> }
        
        <TablePagination
          className="paginator"
          component="div"
          sx={ { marginTop: loading ? '0' : '4px' } }
          rowsPerPageOptions={ pageSizes }
          count={ allItems }
          rowsPerPage={ pageSize }
          page={ page }
          showFirstButton
          showLastButton
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
        />
      </Paper>
    </Box>
  );
}
