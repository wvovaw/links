import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../common/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { LinksService } from "../links/links.service";
import { User } from "../users/user.entity";
import { AnalyticsService } from "./analytics.service";
import { ActivityQueryDto } from "./dto/activity-query.dto";
import { StatsQueryDto } from "./dto/block-event.dto";

/**
 * The owner's reads. They live in their own controller rather than in `LinksController` so no route has to
 * be declared before or after `GET /links/:id` to be reachable — a trap that only shows up at runtime.
 *
 * It is registered by `LinksModule`, which already imports this module; declaring it here would make the
 * two modules import each other.
 *
 * `StatsQueryDto`, `ActivityQueryDto` and `User` are value imports on purpose: Nest reads the parameter types
 * off the emitted metadata to decide what to validate, and an `import type` erases the class before that
 * metadata is written — the endpoint would then accept `?from=yesterday` and hand it to SQLite.
 */
@Controller("analytics")
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(
    private readonly linksService: LinksService,
    private readonly analytics: AnalyticsService,
  ) {}

  /** Every page the caller owns, including the ones nobody opened — those are rows of zeros. */
  @Get("overview")
  async overview(@CurrentUser() user: User, @Query() query: StatsQueryDto) {
    return this.analytics.overview(await this.linksService.list(user), query);
  }

  /**
   * The live feed across every page the caller owns. It takes no range on purpose: switching the range picker
   * must never empty it, and the `all time` preset needs no special case.
   */
  @Get("activity")
  async activity(@CurrentUser() user: User, @Query() query: ActivityQueryDto) {
    return { items: await this.analytics.activity(await this.linksService.list(user), query.limit) };
  }

  /**
   * Ownership is settled before any aggregate runs: `getOwned` answers 404 for a page the caller does not
   * own, so one owner cannot read another page's numbers.
   */
  @Get("links/:id")
  async link(@CurrentUser() user: User, @Param("id") id: string, @Query() query: StatsQueryDto) {
    const link = await this.linksService.getOwned(user, id);

    return this.analytics.linkStats(link.id, query);
  }
}
