import { app } from '../app';
import { TESTER, TICKET, Context, createTicket } from './config/setup';

describe('get-ticket test', () => {
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

  it('GET "/ticket?id={some-number}" sends TICKET data', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'get',
      url: `/ticket?id=${id}`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.title).toBe(TICKET.title);
    expect(body.price).toBe(TICKET.price);
    expect(body.id).toBe(id);
    expect(body.userId).toEqual(TESTER.id);
  });

  it('GET "/ticket" sends Bad Request for query id', async () => {
    const res = await app.inject({
      method: 'get',
      url: `/ticket`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/id/);
  });

  it('GET "/ticket" sends Unauthorized 401 for cookie', async () => {
    const res = await app.inject({
      method: 'get',
      url: `/ticket?id=2`,
    });

    expect(res.statusCode).toBe(401);
  });
});
