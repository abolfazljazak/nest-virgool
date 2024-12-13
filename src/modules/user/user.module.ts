import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
