import { Module } from '@nestjs/common';
import { CookiesService } from './cookies.service';

@Module({
  providers: [CookiesService],
  exports: [CookiesService],
})
export class CookiesModule {}
