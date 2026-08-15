import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { databaseConfig } from "./database/database.config";
import { LinksModule } from "./links/links.module";
import { PublicModule } from "./public/public.module";
import { StorageModule } from "./storage/storage.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...databaseConfig, migrationsRun: true }),
    AuthModule,
    UsersModule,
    LinksModule,
    PublicModule,
    StorageModule,
  ],
})
export class AppModule {}
