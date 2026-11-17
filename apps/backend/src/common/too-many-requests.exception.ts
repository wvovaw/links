import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * `@nestjs/throttler`'s `ThrottlerException` is not a dependency of this app, and each window that needs a
 * 429 is a dozen lines keyed on a page — or, for a page view, on a visitor's daily-rotating hash, which
 * identifies nobody and is forgotten at midnight. The message belongs to the window that refused, so it is
 * passed in rather than baked into the class.
 */
export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
