import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Repository } from "typeorm";

import { jwtSecret } from "../auth/auth.tokens";
import { User } from "../users/user.entity";

interface AccessTokenPayload {
  sub: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: User }>();
    const token = this.getToken(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret: jwtSecret(),
      });
      const user = await this.users.findOneBy({ id: payload.sub });

      if (!user) throw new UnauthorizedException();

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private getToken(request: Request): string | undefined {
    const cookieToken = request.cookies?.access_token;
    if (typeof cookieToken === "string") return cookieToken;

    const authorization = request.header("authorization");
    if (!authorization?.startsWith("Bearer ")) return undefined;

    return authorization.slice("Bearer ".length);
  }
}
