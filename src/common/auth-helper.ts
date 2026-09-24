/**
 * Helper to safely extract user ID from Express request (via req.user, Bearer JWT, or valid demo UUID fallback)
 */
export const DEFAULT_DEMO_STUDENT_ID = '356e4242-b9ab-431b-b626-0524dacf35ca'; // Jean ANDRIANIRINA

export function extractUserId(req: any, explicitId?: string): string {
  if (explicitId && explicitId !== 'etudiant-demo-id' && explicitId.length > 20) {
    return explicitId;
  }
  if (req?.user?.id) return req.user.id;
  if (req?.user?.sub) return req.user.sub;

  const auth = req?.headers?.authorization;
  if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
    try {
      const token = auth.slice(7).trim();
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload?.sub) return payload.sub;
        if (payload?.id) return payload.id;
      }
    } catch (_) {}
  }

  return DEFAULT_DEMO_STUDENT_ID;
}
