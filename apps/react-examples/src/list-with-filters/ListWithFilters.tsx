import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
}                            from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select/SelectInput'
import { useState }          from 'react'


interface Currency {
  code: string
  name: string
}

export function ListWithFilters() {
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
  }
  
  return (
    <Box sx={ { maxWidth: 1000, margin: 'auto' } }>
      <form>
        <Card sx={ { p: 2, display: 'flex', gap: 1, alignItems: 'center' } }>
          <TextField label="Szukaj" variant="outlined" />
          
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
                <MenuItem value={ currency.code }>{ currency.name }</MenuItem>),
              ) }
            </Select>
          </FormControl>
          
          <Button onClick={ handleClear }>Wyczyść i przeładuj</Button>
        </Card>
      </form>
    </Box>
  )
}
