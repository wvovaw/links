import { Controller, Get, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { access } from "node:fs/promises";
import { LocalStorageService } from "./local-storage.service";

@Controller("storage")
export class StorageController {
  constructor(private readonly storage: LocalStorageService) {}

  @Get("avatars/:fileId")
  async getAvatar(@Param("fileId") fileId: string, @Res() response: Response) {
    const path = this.storage.avatarPath(fileId);

    try {
      await access(path);
    }
    catch {
      throw new NotFoundException("Avatar not found.");
    }

    response.sendFile(path, { root: process.cwd() });
  }
}
