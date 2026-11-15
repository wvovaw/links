import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * `@nestjs/throttler`'s `ThrottlerException` is not a dependency of this app, and each window that needs a
 * 429 is a dozen lines keyed on a page rather than on a visitor — which is the point: this app stores
 * nothing that identifies a caller, so there is no per-visitor key to spend a throttler on. The message
 * belongs to the window that refused, so it is passed in rather than baked into the class.
 */
export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
