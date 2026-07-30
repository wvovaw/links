import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "../users/user.entity";
import { BlockImage } from "./block-image.entity";
import { LocalStorageService } from "./local-storage.service";
import { StorageController } from "./storage.controller";

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([BlockImage, User])],
  controllers: [StorageController],
  providers: [LocalStorageService],
  exports: [LocalStorageService, TypeOrmModule],
})
export class StorageModule {}
