import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import { ticketModel } from '../models';

interface User {
  id: string;
  email: string;
}

interface GetTicket {
  Querystring: {
    id: string;
  };
  Reply: {
    id: number;
    userId: number;
    title: string;
    price: string;
  };
}

export async function getTicketRoutes(
  app: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            title: { type: 'string', minLength: 2, maxLength: 30 },
            price: { type: 'string', maxLength: 10 },
          },
        },
      },
    },
    onRequest: [app.authenticate],
  };

  app.get<GetTicket>('/ticket', opts, async (req, res) => {
    const { id } = req.query;

    const ticket = await ticketModel.findById(id);

    res.status(200);
    return ticket;
  });
}
