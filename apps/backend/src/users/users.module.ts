import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "../common/auth.guard";
import { StorageModule } from "../storage/storage.module";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({}), StorageModule],
  controllers: [UsersController],
  providers: [AuthGuard],
  exports: [TypeOrmModule],
})
export class UsersModule {}
