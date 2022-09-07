import { app } from '../app';
import { cleanupQuery } from '../models';
import { TESTER, TICKET, prepareTest, getTicketId } from './config/setup';

describe('get-ticket test', () => {
  const TITLE = 'get-ticket';

  beforeAll(async () => {
    await prepareTest();
  });

  afterAll(async () => {
    await app.pg.query(cleanupQuery`title ${TITLE}`);
  });

  it('GET "/ticket?id={some-number}" sends {title: get-ticket, price, 12345}', async () => {
    const id = await getTicketId(TITLE);

    const res = await app.inject({
      method: 'get',
      url: `/ticket?id=${id}`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.title).toBe(TITLE);
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
