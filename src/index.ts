import { app } from './app';
import { postgres } from './plugins';
import { PORT, POSTGRES_URL, JWT_SECRET_KEY, COOKIE_KEY } from './constants';

app.register(postgres);

app.listen({ port: PORT, host: '0.0.0.0' }, (err, url) => {
  // fastify startup
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  // postgres connect and create tables (if not exists)
  app.pg.connect((err) => {
    if (err) {
      app.log.error(`Postgres connection ERROR on ${POSTGRES_URL}`);
      process.exit(1);
    }

    app.log.info(`Postgres connected at ${POSTGRES_URL}`);
  });

  // Essential constants check
  if (!JWT_SECRET_KEY) {
    app.log.error('JWT_SECRET_KEY environment variable is not provided');
    process.exit(1);
  }

  if (!COOKIE_KEY) {
    app.log.error('COOKIE_KEY environment variable is not provided');
    process.exit(1);
  }
});
