import Fastify from 'fastify';
import {
  getTicketRoutes,
  getTicketsRoutes,
  greetingRoutes,
  patchTicketRoutes,
  postTicketRoutes,
} from './routes';
import { cors, cookie, postgres, jwt, formBody } from './plugins';
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

// plugins
app.register(cors);
app.register(cookie);
app.register(postgres);
app.register(jwt);
app.register(formBody);

// routes
app.register(greetingRoutes);
app.register(postTicketRoutes);
app.register(getTicketRoutes);
app.register(getTicketsRoutes);
app.register(patchTicketRoutes);
