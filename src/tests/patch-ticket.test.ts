import { app } from '../app';
import { TESTER, createTicket, Context } from './config/setup';

describe('patch-ticket test', () => {
  const TITLE2 = 'patch-ticket-2';
  const PRICE2 = 'price-2';
  const TITLE3 = 'patch-ticket-3';
  const PRICE3 = 'price-3';

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

  it('PATCH "/ticket" changes ticket values', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'patch',
      url: `/ticket`,
      payload: {
        id,
        title: TITLE2,
        price: PRICE2,
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.isUpdated).toBe(true);

    const res2 = await app.inject({
      method: 'get',
      url: `/ticket?id=${id}`,
      cookies: { token: TESTER.cookie },
    });

    const body2 = JSON.parse(res2.body);

    expect(res2.statusCode).toBe(200);
    expect(body2.title).toBe(TITLE2);
    expect(body2.price).toBe(PRICE2);
  });

  it('PATCH "/ticket" changes only title', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'patch',
      url: `/ticket`,
      payload: {
        id,
        title: TITLE3,
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.isUpdated).toBe(true);

    const res2 = await app.inject({
      method: 'get',
      url: `/ticket?id=${id}`,
      cookies: { token: TESTER.cookie },
    });
    const body2 = JSON.parse(res2.body);

    expect(res2.statusCode).toBe(200);
    expect(body2.title).toBe(TITLE3);
  });

  it('PATCH "/ticket" changes only price', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'patch',
      url: `/ticket`,
      payload: {
        id,
        price: PRICE3,
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.isUpdated).toBe(true);

    const res2 = await app.inject({
      method: 'get',
      url: `/ticket?id=${id}`,
      cookies: { token: TESTER.cookie },
    });
    const body2 = JSON.parse(res2.body);

    expect(res2.statusCode).toBe(200);
    expect(body2.price).toBe(PRICE3);
  });

  it('PATCH "/ticket" sends Bad Request for id', async () => {
    const res = await app.inject({
      method: 'patch',
      url: `/ticket`,
      payload: {
        title: TITLE2,
        price: PRICE2,
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/id/);
  });

  it('PATCH "/ticket" sends Bad Request for short title', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'patch',
      url: `/ticket`,
      payload: {
        id,
        title: 'a',
        price: PRICE2,
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/title/);
  });

  it('PATCH "/ticket" sends Bad Request for long price', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'patch',
      url: `/ticket`,
      payload: {
        id,
        title: TITLE2,
        price: '333333333333333333333333',
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/price/);
  });

  it('PATCH "/ticket" sends Bad Request for empty payload', async () => {
    const id = await createTicket();

    const res = await app.inject({
      method: 'patch',
      url: `/ticket`,
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/body/);
  });

  it('PATCH "/ticket" sends Unauthorized 401 for cookie', async () => {
    const res = await app.inject({
      method: 'get',
      url: `/ticket`,
      payload: {
        title: TITLE2,
        price: PRICE2,
      },
    });

    expect(res.statusCode).toBe(401);
  });
});
