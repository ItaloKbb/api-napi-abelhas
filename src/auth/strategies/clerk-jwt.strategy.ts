import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { createPublicKey } from 'crypto';

/**
 * Normalized user object set on `request.user` after JWT validation.
 * Handles both Clerk session token v1 (flat org_*) and v2 (nested `o` claim).
 */
export interface ClerkUser {
  sub: string;
  email?: string;
  azp?: string;
  iss?: string;
  org_id?: string;
  org_slug?: string;
  org_role?: string;
}

/** Raw Clerk v2 session token payload */
interface ClerkJwtPayloadV2 {
  sub: string;
  email?: string;
  azp?: string;
  iss?: string;
  v?: number;
  /** v2 nested organization claim */
  o?: {
    id: string;
    slg: string;
    /** Short role string, e.g. "admin" */
    rol: string;
    per?: string;
    fpm?: string;
  };
  /** v1 flat org claims */
  org_id?: string;
  org_slug?: string;
  org_role?: string;
}

const jwksCache = new Map<string, string>();
let jwksCacheExpiry = 0;
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000;

async function getPublicKeyFromJwks(
  jwksUri: string,
  kid: string,
): Promise<string> {
  const now = Date.now();
  if (jwksCacheExpiry > now && jwksCache.has(kid)) {
    return jwksCache.get(kid)!;
  }

  const response = await fetch(jwksUri);
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
  }

  const { keys } = (await response.json()) as {
    keys: Array<{ kid: string; n: string; e: string; kty: string }>;
  };
  jwksCache.clear();
  jwksCacheExpiry = now + JWKS_CACHE_TTL_MS;

  for (const key of keys) {
    if (key.kty === 'RSA') {
      const publicKey = createPublicKey({
        key: { kty: key.kty, n: key.n, e: key.e },
        format: 'jwk',
      });
      const pem = publicKey.export({ type: 'spki', format: 'pem' }) as string;
      jwksCache.set(key.kid, pem);
    }
  }

  const pem = jwksCache.get(kid);
  if (!pem) {
    throw new Error(`No key found for kid: ${kid}`);
  }
  return pem;
}

@Injectable()
export class ClerkJwtStrategy extends PassportStrategy(Strategy, 'clerk-jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (
        _request: unknown,
        rawJwtToken: unknown,
        done: (err: Error | null, key?: string | Buffer) => void,
      ): void => {
        const jwksUri = configService.get<string>('CLERK_JWKS_URI')!;
        const [headerB64] = (rawJwtToken as string).split('.');
        const header = JSON.parse(
          Buffer.from(headerB64, 'base64url').toString(),
        ) as { kid: string };

        getPublicKeyFromJwks(jwksUri, header.kid)
          .then((key) => done(null, key))
          .catch((err: Error) => done(err));
      },
      ignoreExpiration: false,
    });
  }

  /**
   * Normalizes the Clerk JWT payload into a flat ClerkUser object.
   * Handles both v1 (flat org_id/org_slug/org_role) and v2 (nested `o` claim)
   * token formats as documented at:
   * https://clerk.com/docs/reference/backend/types/auth-object
   */
  validate(payload: ClerkJwtPayloadV2): ClerkUser {
    const org = payload.o;

    return {
      sub: payload.sub,
      email: payload.email,
      azp: payload.azp,
      iss: payload.iss,
      // v2: nested under `o`, v1: flat claims
      org_id: org?.id ?? payload.org_id,
      org_slug: org?.slg ?? payload.org_slug,
      // v2 uses short form (e.g. "admin"), normalize to "org:admin"
      org_role: org?.rol
        ? `org:${org.rol}`
        : payload.org_role,
    };
  }
}
