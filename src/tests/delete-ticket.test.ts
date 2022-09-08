import { app } from '../app';
import { TESTER, Context, createTicket } from './config/setup';

describe('delete-ticket test', () => {
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

  it('DELETE "/ticket?id={some-number}" deletes TICKET data', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'delete',
      url: `/ticket?id=${id}`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.isDeleted).toBe(true);

    const res2 = await app.inject({
      method: 'get',
      url: `/ticket?id=${id}`,
      cookies: { token: TESTER.cookie },
    });

    const body2 = JSON.parse(res2.body);

    expect(res2.statusCode).toBe(404);
    expect(body2.message).toMatch(/id/);
  });

  it('DELETE "/ticket" sends Bad Request for query id', async () => {
    const res = await app.inject({
      method: 'delete',
      url: `/ticket`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/id/);
  });

  it('DELETE "/ticket" sends Unauthorized 401 for cookie', async () => {
    const res = await app.inject({
      method: 'get',
      url: `/ticket?id=1`,
    });

    expect(res.statusCode).toBe(401);
  });
});
