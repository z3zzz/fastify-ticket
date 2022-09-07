import './environment-variables';
import { app } from '../../app';

// default user info for auth
export const TESTER = {
  email: 'signin@example.com',
  id: 100,
  cookie:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJlbWFpbCI6InNpZ25pbkBleGFtcGxlLmNvbSIsImlhdCI6MTY2MDYzODg1N30.oqZn8yAe0Nx7Q4tD8p5E66o13w1pH89PHkCSQf3zkho.2xZgvMf1uw3z6N28WoffzkFdbAe2hTODTexiGrpsH+Y',
};

export const TICKET = {
  title: 'test-ticket',
  price: '494410',
};

export const prepareTest = async (): Promise<void> => {
  // bootstrap all plugins
  await app.inject({ url: '/' });

  app.pg.connect((err) => {
    if (err) {
      app.log.error(`Postgres connection ERROR on ${process.env.POSTGRES_URL}`);
      process.exit(1);
    }

    app.log.info(`Postgres connected at ${process.env.POSTGRES_URL}`);
  });
};

const ticketIds: Record<string, string> = {};
export const getTicketId = async (title?: string): Promise<string> => {
  if (title && ticketIds[title]) {
    return ticketIds[title];
  }

  if (title && !ticketIds[title]) {
    const id = await createTicket(title);
    ticketIds[title] = id;

    return id;
  }

  const id = await createTicket();

  return id;
};

async function createTicket(title?: string) {
  const res = await app.inject({
    method: 'POST',
    url: '/ticket',
    payload: title
      ? {
          ...TICKET,
          title,
        }
      : TICKET,
    cookies: { token: TESTER.cookie },
  });

  const body = JSON.parse(res.body);

  return body.id;
}
