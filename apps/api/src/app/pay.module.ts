import { Module } from '@nestjs/common';

import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { HttpModule } from '@nestjs/axios';
import { VonageService } from './vonage.service';

@Module({
  imports: [
    HttpModule
  ],
  providers: [PayService, VonageService],
  controllers: [PayController],
})
export class PayModule {}
