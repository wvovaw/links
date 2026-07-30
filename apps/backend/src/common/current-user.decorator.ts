import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { User } from "../users/user.entity";

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => context.switchToHttp().getRequest().user,
);
