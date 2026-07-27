import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { Link } from "./links/link.entity";
import { LinksModule } from "./links/links.module";
import { PublicModule } from "./public/public.module";
import { BlockImage } from "./storage/block-image.entity";
import { StorageModule } from "./storage/storage.module";
import { RefreshSession } from "./auth/refresh-session.entity";
import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqljs",
      location: process.env.DATABASE_PATH ?? "data.sqlite",
      autoSave: true,
      entities: [User, RefreshSession, Link, BlockImage],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    LinksModule,
    PublicModule,
    StorageModule,
  ],
})
export class AppModule {}
