import { Module } from "@nestjs/common";
import { LinksModule } from "../links/links.module";
import { PublicLinksController } from "./public-links.controller";

@Module({
  imports: [LinksModule],
  controllers: [PublicLinksController],
})
export class PublicModule {}
