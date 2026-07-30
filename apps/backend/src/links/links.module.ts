import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthGuard } from "../common/auth.guard";
import { BlockImage } from "../storage/block-image.entity";
import { StorageModule } from "../storage/storage.module";
import { User } from "../users/user.entity";
import { Link } from "./link.entity";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";

@Module({
  imports: [TypeOrmModule.forFeature([Link, User, BlockImage]), JwtModule.register({}), StorageModule],
  controllers: [LinksController],
  providers: [LinksService, AuthGuard],
  exports: [LinksService, TypeOrmModule],
})
export class LinksModule {}
