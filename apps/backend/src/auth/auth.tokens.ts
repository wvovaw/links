export function jwtSecret() {
  return process.env.JWT_SECRET ?? "dev-only-change-me";
}

export function accessTokenMaxAgeMs() {
  return 15 * 60 * 1000;
}

export function refreshTokenMaxAgeMs() {
  return 30 * 24 * 60 * 60 * 1000;
}
