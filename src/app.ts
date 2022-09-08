import Fastify from 'fastify';
import {
  getTicketRoutes,
  getTicketsRoutes,
  greetingRoutes,
  patchTicketRoutes,
  postTicketRoutes,
  deleteTicketRoutes,
} from './routes';
import { cors, cookie, jwt, formBody } from './plugins';
import { NODE_ENV } from './constants';

// main
export const app = Fastify({
  logger: {
    transport:
      NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: { ignore: 'pid,hostname' },
          }
        : undefined,
  },
  disableRequestLogging: true,
});

// plugins (except postgres, which is in ./index.js)
app.register(cors);
app.register(cookie);
app.register(jwt);
app.register(formBody);

// routes
app.register(greetingRoutes);
app.register(postTicketRoutes);
app.register(getTicketRoutes);
app.register(getTicketsRoutes);
app.register(patchTicketRoutes);
app.register(deleteTicketRoutes);
