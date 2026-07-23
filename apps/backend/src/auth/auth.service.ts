import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon2 from "argon2";
import { randomBytes } from "node:crypto";
import { MoreThan, Repository } from "typeorm";
import { accessTokenMaxAgeMs, jwtSecret, refreshTokenMaxAgeMs } from "./auth.tokens";
import { RefreshSession } from "./refresh-session.entity";
import { User } from "../users/user.entity";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(RefreshSession) private readonly refreshSessions: Repository<RefreshSession>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, username: string, password: string) {
    const existing = await this.users.findOneBy({ email });
    if (existing)
      throw new ConflictException("A user with this email already exists.");

    const user = this.users.create({
      email,
      name: username,
      passwordHash: await argon2.hash(password),
      avatarFileId: null,
    });

    return this.users.save(user);
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.users.findOneBy({ email });
    if (!user || !await argon2.verify(user.passwordHash, password))
      throw new UnauthorizedException("Invalid email or password.");

    return { user, tokens: await this.createTokenPair(user) };
  }

  async refresh(refreshToken: string): Promise<{ user: User; tokens: AuthTokens }> {
    const candidates = await this.refreshSessions.find({
      where: { expiresAt: MoreThan(new Date()) },
      relations: { user: true },
    });
    const session = await this.findMatchingSession(candidates, refreshToken);

    if (!session)
      throw new UnauthorizedException("Invalid refresh token.");

    const rawRefreshToken = this.generateRefreshToken();
    session.tokenHash = await argon2.hash(rawRefreshToken);
    session.expiresAt = new Date(Date.now() + refreshTokenMaxAgeMs());
    await this.refreshSessions.save(session);

    return {
      user: session.user,
      tokens: {
        accessToken: await this.createAccessToken(session.user),
        refreshToken: rawRefreshToken,
      },
    };
  }

  async logout(refreshToken: string) {
    const candidates = await this.refreshSessions.find();
    const session = await this.findMatchingSession(candidates, refreshToken);

    if (session)
      await this.refreshSessions.remove(session);
  }

  private async createTokenPair(user: User): Promise<AuthTokens> {
    const refreshToken = this.generateRefreshToken();
    const session = this.refreshSessions.create({
      user,
      tokenHash: await argon2.hash(refreshToken),
      expiresAt: new Date(Date.now() + refreshTokenMaxAgeMs()),
    });
    await this.refreshSessions.save(session);

    return {
      accessToken: await this.createAccessToken(user),
      refreshToken,
    };
  }

  private async createAccessToken(user: User) {
    return this.jwtService.signAsync(
      { sub: user.id },
      { secret: jwtSecret(), expiresIn: Math.floor(accessTokenMaxAgeMs() / 1000) },
    );
  }

  private generateRefreshToken() {
    return randomBytes(48).toString("base64url");
  }

  private async findMatchingSession(sessions: RefreshSession[], refreshToken: string) {
    for (const session of sessions) {
      if (await argon2.verify(session.tokenHash, refreshToken))
        return session;
    }

    return undefined;
  }
}
