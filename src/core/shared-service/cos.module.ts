import { Module } from '@nestjs/common';
import { CosService } from './cos.service';

@Module({
  // imports: [UserController],
  providers: [CosService],
  exports: [CosService],
})
export class CosModule {}
