import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "../users/user.entity";
import { LocalStorageService } from "./local-storage.service";
import { StorageController } from "./storage.controller";
import { UploadedFile } from "./uploaded-file.entity";
import { UploadedFilesService } from "./uploaded-files.service";

@Module({
  /* `User` is here for `AuthGuard`, which resolves its repository in the module it guards. */
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UploadedFile, User])],
  controllers: [StorageController],
  providers: [LocalStorageService, UploadedFilesService],
  exports: [LocalStorageService, UploadedFilesService, TypeOrmModule],
})
export class StorageModule {}
