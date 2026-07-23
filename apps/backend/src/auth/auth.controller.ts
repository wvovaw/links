import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthGuard } from "../common/auth.guard";
import { toUserDto } from "../users/user.dto";
import { User } from "../users/user.entity";
import { accessTokenMaxAgeMs } from "./auth.tokens";
import { AuthService, AuthTokens } from "./auth.service";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterDto) {
    return toUserDto(await this.authService.register(body.email, body.username, body.password));
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { user, tokens } = await this.authService.login(body.email, body.password);
    this.setAccessCookie(response, tokens.accessToken);
    return { user: toUserDto(user), refreshToken: tokens.refreshToken };
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) response: Response) {
    const { user, tokens } = await this.authService.refresh(body.refreshToken);
    this.setAccessCookie(response, tokens.accessToken);
    return { user: toUserDto(user), refreshToken: tokens.refreshToken };
  }

  @Post("logout")
  @HttpCode(204)
  async logout(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(body.refreshToken);
    response.clearCookie("access_token");
  }

  @Get("session")
  @UseGuards(AuthGuard)
  session(@CurrentUser() user: User) {
    return toUserDto(user);
  }

  private setAccessCookie(response: Response, accessToken: AuthTokens["accessToken"]) {
    response.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: accessTokenMaxAgeMs(),
    });
  }
}
