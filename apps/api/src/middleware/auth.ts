import { GetVerificationKey, expressjwt } from "express-jwt";

const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE;
const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET;

// Create middleware for checking the JWT
export const auth = expressjwt({
  secret: AUTH_JWT_SECRET as unknown as GetVerificationKey,
  // Validate the audience and the issuer.
  audience: AUTH_AUDIENCE,
  issuer: AUTH_DOMAIN,
  algorithms: ["RS256", "HS256"],
});
