import SearchIcon                from '@mui/icons-material/Search';
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
  TextField,
  Typography
}                                from '@mui/material';
import { SelectChangeEvent }     from '@mui/material/Select/SelectInput';
import { Etf }                   from '@org/common-lib';
import { ChangeEvent, useState } from 'react';

import styles                 from './list-with-filters.module.scss';
import { useDebouncedEffect } from './use-debunce-effect';

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
  const [ filters, setFilters ] = useState({
    search: '',
    priceMin: '',
    priceMax: '',
    currency: '',
  });
  const [ sortProperty, setSortProperty ] = useState<undefined | string>(undefined);
  const [ sortDirection, setSortDirection ] = useState<undefined | 'asc' | 'desc'>(undefined);
  const [ page, setPage ] = useState(0);
  const [ pageSize, setPageSize ] = useState(pageSizes[0]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isError, setIsError ] = useState(false);
  const [ retry, setRetry ] = useState(0);
  
  const etfService = useEtfsService();
  
  function handleCurrencyChange(e: SelectChangeEvent<string>): void {
    setFilters( f => ({ ...f, currency: e.target?.value ?? '' }));
  }
  
  function handleChangePage(_: unknown, newPage: number) {
    setPage(newPage);
  }
  
  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  }
  
  function handleClear(): void {
    setFilters({
      search: '',
      priceMin: '',
      priceMax: '',
      currency: '',
    });
    setSortProperty(undefined);
    setSortDirection(undefined);
  }
  
useDebouncedEffect(() => {
    console.log({ retry });
    setIsLoading(true);
    
    const sub = etfService
      .getEtfList(
        page + 1,
        pageSize,
        {
          ...filters,
          priceMin: parseFloat(filters.priceMin) || null,
          priceMax: parseFloat(filters.priceMax) || null,
        },
        sortProperty,
        sortDirection
      )
      .subscribe({
        next: page => {
          console.log({ page });
          
          setRows(page.items);
          setAllItems(page.itemsCount);
          setIsLoading(false);
          setIsError(false);
        },
        error: (e) => {
          console.log({ e });
          
          setIsLoading(false);
          setIsError(true);
        }
      });
    
    return () => { sub.unsubscribe(); };
  },
  [ etfService, page, pageSize, filters, sortProperty, sortDirection, retry ],
  200
);
  
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = pageSize - rows.length;
  
  function toggleSort(property: string) {
    const isAsc = sortProperty === property && sortDirection === 'asc';
    
    setSortProperty(property);
    setSortDirection(isAsc ? 'desc' : 'asc');
  }
  
  function handleRetry() {
    setRetry(v => v + 1);
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
            label="Szukaj"
            variant="outlined"
            InputProps={ {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            } }
            value={ filters.search }
            onChange={ e => setFilters(f => ({ ...f, search: e.target.value })) }
          />
          
          <TextField
            label="Cena minimalna"
            variant="outlined"
            type="number"
            value={ filters.priceMin }
            onChange={ e => setFilters(f => ({ ...f, priceMin: e.target.value })) }
          />
          <TextField
            label="Cena maksymalna"
            variant="outlined"
            type="number"
            value={ filters.priceMax }
            onChange={ e => setFilters(f => ({ ...f, priceMax: e.target.value })) }
          />
          
          <FormControl>
            <InputLabel>Waluta</InputLabel>
            
            <Select
              value={ filters.currency || '' }
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
              { (emptyRows > 0 && !isError) && (
                <TableRow style={ { height: 53 * emptyRows } }>
                  <TableCell colSpan={ 3 } />
                </TableRow>
              ) }
            </TableBody>
          </Table>
        </TableContainer>
        
        { isError && (
          <div className={ styles.error }>
            {
              !rows.length && (
                <svg
                  className={ styles.icon }
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  data-testid="ErrorIcon"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z"></path>
                </svg>
              )
            }
            <Typography>Wystąpił niespodziewany błąd</Typography>
            <Button onClick={ handleRetry }>Spróbuj ponownie</Button>
          </div>
        ) }
        
        { isLoading && <LinearProgress /> }
        
        <TablePagination
          className="paginator"
          component="div"
          sx={ { marginTop: isLoading ? '0' : '4px' } }
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
