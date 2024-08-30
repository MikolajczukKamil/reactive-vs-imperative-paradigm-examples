import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { EtfService }    from './etf.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [EtfService],
})
export class AppModule {}
