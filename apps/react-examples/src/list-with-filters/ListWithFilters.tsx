import SearchIcon                           from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
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
}                                           from '@mui/material'
import { SelectChangeEvent }                from '@mui/material/Select/SelectInput'
import { ChangeEvent, useEffect, useState } from 'react'

import { Etf, Sort, useEtfsService } from './etfs'


interface Currency {
  code: string
  name: string
}


export function ListWithFilters() {
  const etfService = useEtfsService()
  
  const [ currency, setCurrency ] = useState<string | null>(null)
  
  const currencies: Currency[] = [
    { code: 'USD', name: 'Dolar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Funt' },
    { code: 'CHF', name: 'Frank' },
    { code: 'PLN', name: 'Złoty' },
  ]
  
  function handleCurrencyChange(e: SelectChangeEvent<string>): void {
    setCurrency(e.target?.value || null)
  }
  
  function handleClear(): void {
    setCurrency(null)
    setSort({ active: '', direction: false })
  }
  
  const [ sort, setSort ] = useState<Sort>({ active: '', direction: false })
  const [ page, setPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(5)
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }
  
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  
  const [ rows, setRows ] = useState<Etf[]>([])
  
  useEffect(() => {
    etfService.getEtfList(1, 10).then(page => setRows(page.items))
  }, [])
  
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  
  const headCells = [
    {
      name: 'name',
      label: 'Nazwa',
    }, {
      name: 'price',
      label: 'Cena',
    }, {
      name: 'currency',
      label: 'Waluta',
    },
  ]
  
  function toggleSort(active: string) {
    const isAsc = sort.active === active && sort.direction === 'asc'
    
    setSort({
      active,
      direction: isAsc ? 'desc' : 'asc',
    })
  }
  
  return (
    <Box sx={ { maxWidth: 1000, margin: 'auto' } }>
      <form>
        <Card sx={ { p: 2, mb: 2, display: 'flex', gap: 1, alignItems: 'center', '& > *': { flex: 1 } } }>
          <TextField
            label="Szukaj" variant="outlined" InputProps={ {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
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
                >{ currency.name }</MenuItem>),
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
                    sortDirection={ sort.active === headCell.name ? sort.direction : false }
                  >
                    <TableSortLabel
                      active={ sort.active === headCell.name }
                      direction={ sort.active === headCell.name && sort.direction === 'desc' ? 'desc' : 'asc' }
                      onClick={ () => toggleSort(headCell.name) }
                    >
                      { headCell.label }
                    </TableSortLabel>
                  </TableCell>
                )) }
              </TableRow>
            </TableHead>
            
            <TableBody>
              { rows.map((row, index) => (
                <TableRow hover role="checkbox" key={ row.name }>
                  <TableCell>{ row.name }</TableCell>
                  <TableCell>{ row.price }</TableCell>
                  <TableCell>{ row.currency }</TableCell>
                </TableRow>
              )) }
              { emptyRows > 0 && (
                <TableRow style={ { height: 53 * emptyRows } }>
                  <TableCell colSpan={ 5 } />
                </TableRow>
              ) }
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={ [ 5, 10, 25 ] }
          count={ rows.length + 10 }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
        />
      </Paper>
    </Box>
  )
}
