import { ApiProperty }  from '@nestjs/swagger';
import { Etf, EtfPage } from '@org/common-lib';


export class EtfEntity implements Etf {
  @ApiProperty()
  readonly name: string = '';
  
  @ApiProperty()
  readonly currency: string = 'EUR';
  
  @ApiProperty()
  readonly price: number = 472;
}

export abstract class EtfPageEntity implements EtfPage {
  @ApiProperty({
    example: [ new EtfEntity() ],
    isArray: true,
    type: EtfEntity,
    description: 'List of funds meeting the search criteria limited to the searched page'
  })
  readonly items: EtfEntity[];
  
  @ApiProperty({ example: 1045, description: 'Number of funds meeting the search criteria' })
  readonly itemsCount: number;
}
