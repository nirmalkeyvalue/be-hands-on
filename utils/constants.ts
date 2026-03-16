import 'dotenv/config'

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_VALIDITY = parseInt(process.env.JWT_VALIDITY ?? '1h');

if (!JWT_SECRET || !JWT_VALIDITY) {
  throw new Error("JWT_SECRET and JWT_VALIDITY must be set");
}
