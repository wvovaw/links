import { Module } from "@nestjs/common";

import { AnalyticsModule } from "../analytics/analytics.module";
import { FormsModule } from "../forms/forms.module";
import { LinksModule } from "../links/links.module";
import { PublicEventsController } from "./public-events.controller";
import { PublicFormsController } from "./public-forms.controller";
import { PublicLinksController } from "./public-links.controller";

@Module({
  imports: [LinksModule, AnalyticsModule, FormsModule],
  controllers: [PublicLinksController, PublicEventsController, PublicFormsController],
})
export class PublicModule {}
