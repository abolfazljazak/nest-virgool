import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BlogEntity])
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
