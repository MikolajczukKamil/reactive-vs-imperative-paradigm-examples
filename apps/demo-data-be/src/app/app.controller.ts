import { Controller, Get, ParseFloatPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags }         from '@nestjs/swagger';
import { SortDirection, SortProperty }                          from '@org/common-lib';

import { EtfPageEntity } from './etf-page.entity';
import { EtfService }    from './etf.service';


@ApiTags('ETF')
@Controller()
export class AppController {
  constructor(private readonly etfService: EtfService) {}
  
  @Get('etf')
  @ApiOperation({ summary: 'ETF search' })
  @ApiResponse({ status: 401, description: 'Unauthorized, access is denied' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ type: EtfPageEntity, description: 'ETF search' })
  @ApiQuery({ name: 'page', required: false, type: 'int', example: 2 })
  @ApiQuery({ name: 'page-size', required: false, type: 'int', example: 10 })
  @ApiQuery({ name: 'sort-property', required: false, type: String, example: 'price' })
  @ApiQuery({ name: 'sort-direction', required: false, type: 'asc | desc', example: 'desc' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 10 })
  @ApiQuery({
    name: 'currency',
    required: false,
    type: 'EUR | USD | PLN | GBP | CHF',
    example: 'USD'
  })
  @ApiQuery({ name: 'min-price', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'max-price', required: false, type: Number, example: 50 })
  public async getData(
    @Query('page', ParseIntPipe) page: number,
    @Query('page-size', ParseIntPipe) pageSize: number,
    @Query('sort-property') sortProperty?: SortProperty,
    @Query('sort-direction') sortDirection?: SortDirection,
    @Query('search') search?: string,
    @Query('currency') currency?: string,
    @Query('min-price', new ParseFloatPipe({ optional: true })) minPrice?: number,
    @Query('max-price', new ParseFloatPipe({ optional: true })) maxPrice?: number
  ): Promise<EtfPageEntity> {
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
