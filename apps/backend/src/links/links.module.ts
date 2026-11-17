import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsController } from "../analytics/analytics.controller";
import { AnalyticsModule } from "../analytics/analytics.module";
import { AuthGuard } from "../common/auth.guard";
import { FormsModule } from "../forms/forms.module";
import { BlockAsset } from "../storage/block-asset.entity";
import { BlockImage } from "../storage/block-image.entity";
import { StorageModule } from "../storage/storage.module";
import { User } from "../users/user.entity";
import { Link } from "./link.entity";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Link, User, BlockAsset, BlockImage]),
    JwtModule.register({}),
    StorageModule,
    AnalyticsModule,
    FormsModule,
  ],
  controllers: [LinksController, AnalyticsController],
  providers: [LinksService, AuthGuard],
  exports: [LinksService, TypeOrmModule],
})
export class LinksModule {}
