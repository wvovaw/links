import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsService } from "./analytics.service";
import { BlockEvent } from "./block-event.entity";
import { PageView } from "./page-view.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BlockEvent, PageView])],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
