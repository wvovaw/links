import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsService } from "./analytics.service";
import { BlockEvent } from "./block-event.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BlockEvent])],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
