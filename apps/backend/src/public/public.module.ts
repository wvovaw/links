import { Module } from "@nestjs/common";

import { AnalyticsModule } from "../analytics/analytics.module";
import { LinksModule } from "../links/links.module";
import { PublicEventsController } from "./public-events.controller";
import { PublicLinksController } from "./public-links.controller";

@Module({
  imports: [LinksModule, AnalyticsModule],
  controllers: [PublicLinksController, PublicEventsController],
})
export class PublicModule {}
