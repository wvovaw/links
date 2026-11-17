import type { Response } from "express";

import { ArgumentsHost, Catch, ExceptionFilter, PayloadTooLargeException } from "@nestjs/common";

import { UploadTooLargeException } from "./local-storage.service";

/**
 * multer fails an oversized upload while it is still streaming, before the route handler runs, and
 * reports it as a bare `PayloadTooLargeException` ("File too large"). The upload routes answer with
 * `UploadTooLargeException` instead, which names the limit. Nothing is written for such a request:
 * the interceptor rejects it, so `saveImage` and `saveAvatar` are never called.
 */
@Catch(PayloadTooLargeException)
export class UploadTooLargeFilter implements ExceptionFilter {
  catch(_exception: PayloadTooLargeException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const exception = new UploadTooLargeException();

    response.status(exception.getStatus()).json(exception.getResponse());
  }
}
