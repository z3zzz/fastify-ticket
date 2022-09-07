import { app } from '../app';
import { cleanupQuery } from '../models';
import { TESTER, TICKET, prepareTest, getTicketId } from './config/setup';

describe('get-tickets test', () => {
  const TITLE = 'get-tickets';

  beforeAll(async () => {
    await prepareTest();
  });

  afterAll(async () => {
    await app.pg.query(cleanupQuery`title ${TITLE}`);
  });

  it('GET "/tickets" sends [{title: get-tickets, price, 12345}]', async () => {
    const id = await getTicketId(TITLE);

    const res = await app.inject({
      method: 'get',
      url: `/tickets?limit=20&offset=0`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);
    const ticket = expect.objectContaining({
      title: TITLE,
      price: TICKET.price,
    });
    const tickets = expect.arrayContaining([ticket]);

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
