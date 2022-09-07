import fastifyPlugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import fastifyCookie, { CookieSerializeOptions } from '@fastify/cookie';
import type { FastifyCookieOptions } from '@fastify/cookie';
import { COOKIE_KEY, DOMAIN, NODE_ENV } from '../constants';

export const cookieOpt: CookieSerializeOptions = {
  domain: DOMAIN,
  path: '/',
  secure: NODE_ENV === 'production', // send cookie over HTTPS only
  httpOnly: true,
  sameSite: NODE_ENV === 'production', // alternative CSRF protection
  signed: true, // encrypt cookie,
};

export const cookie = fastifyPlugin(async (fastify, options) => {
  fastify.register(
    fastifyCookie as unknown as FastifyPluginAsync<FastifyCookieOptions>,
    {
      secret: COOKIE_KEY,
    }
  );
});
