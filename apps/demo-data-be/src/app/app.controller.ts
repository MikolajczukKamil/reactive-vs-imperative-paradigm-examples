import { Controller, Get, ParseFloatPipe, ParseIntPipe, Query } from '@nestjs/common';
import { SortDirection, SortProperty }                          from '@org/common-lib';

import { EtfService } from './etf.service';


@Controller()
export class AppController {
  constructor(private readonly etfService: EtfService) {}
  
  @Get('etf')
  public async getData(
    @Query('page', ParseIntPipe) page: number,
    @Query('page-size', ParseIntPipe) pageSize: number,
    @Query('sort-property') sortProperty?: SortProperty,
    @Query('sort-direction') sortDirection?: SortDirection,
    @Query('search') search?: string,
    @Query('currency') currency?: string,
    @Query('min-price', new ParseFloatPipe({ optional: true })) minPrice?: number,
    @Query('max-price', new ParseFloatPipe({ optional: true })) maxPrice?: number
  ) {
    console.debug({
      page,
      pageSize,
      search,
      currency,
      minPrice,
      maxPrice,
      sortProperty,
      sortDirection
    });
    
    return this.etfService.getEtfList(page, pageSize, {
      search,
      currency,
      minPrice,
      maxPrice
    }, { property: sortProperty, direction: sortDirection });
  }
}
