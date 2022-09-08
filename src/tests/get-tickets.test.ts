import { app } from '../app';
import { TESTER, TICKET, createTicket, Context } from './config/setup';

describe('get-tickets test', () => {
  let context: Context;

  beforeAll(async () => {
    context = await Context.build();
  });

  beforeEach(async () => {
    await context.reset('tickets');
  });

  afterAll(async () => {
    await context.clean();
  });

  it('GET "/tickets" sends [{title: ticket1, price: ---}, {title: ticket2, price: ---}]', async () => {
    await createTicket('ticket1');
    await createTicket('ticket2');

    const res = await app.inject({
      method: 'get',
      url: `/tickets?limit=20&offset=0`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    const ticket1 = expect.objectContaining({
      title: 'ticket1',
      price: TICKET.price,
    });
    const ticket2 = expect.objectContaining({
      title: 'ticket2',
      price: TICKET.price,
    });

    const tickets = expect.arrayContaining([ticket1, ticket2]);

    expect(res.statusCode).toBe(200);
    expect(body).toEqual(tickets);
  });

  it('GET "/tickets" sends Bad Request for high query limit', async () => {
    const res = await app.inject({
      method: 'get',
      url: `/tickets?limit=101`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/limit/);
  });

  it('GET "/tickets" sends Bad Request for low query limit', async () => {
    const res = await app.inject({
      method: 'get',
      url: `/tickets?limit=0`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/limit/);
  });

  it('GET "/tickets" sends Unauthorized 401 for cookie', async () => {
    const res = await app.inject({
      method: 'get',
      url: `/tickets`,
    });

    expect(res.statusCode).toBe(401);
  });
});
