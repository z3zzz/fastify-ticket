import { app } from '../app';
import { ticketModel } from '../models';
import { TESTER, TICKET, Context } from './config/setup';

describe('post-ticket test', () => {
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

  it('POST "/ticket" creates TICKET', async () => {
    const numberOfRows1 = await ticketModel.count();

    const res = await app.inject({
      method: 'post',
      url: '/ticket',
      payload: TICKET,
      cookies: { token: TESTER.cookie },
    });

    const numberOfRows2 = await ticketModel.count();

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(body.title).toBe(TICKET.title);
    expect(body.price).toBe(TICKET.price);
    expect(body.id).toEqual(expect.any(Number));
    expect(numberOfRows2 - numberOfRows1).toBe(1);
  });

  it('POST "/ticket" sends Bad Request for title', async () => {
    const res = await app.inject({
      method: 'post',
      url: '/ticket',
      payload: {
        title: 'a',
        price: '1234',
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/title/);
  });

  it('POST "/ticket" sends Bad Request for price', async () => {
    const res = await app.inject({
      method: 'post',
      url: '/ticket',
      payload: {
        title: 'abc',
        price: '1111111111111111111111111',
      },
      cookies: { token: TESTER.cookie },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.message).toMatch(/price/);
  });

  it('POST "/ticket" sends Unauthorized 401 for cookie', async () => {
    const res = await app.inject({
      method: 'post',
      url: '/ticket',
      payload: {
        title: 'abc',
        price: '12345',
      },
    });

    expect(res.statusCode).toBe(401);
  });
});
