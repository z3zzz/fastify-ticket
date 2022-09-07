import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import { ticketModel } from '../models';

interface GetTickets {
  Querystring: {
    limit: number;
    offset: number;
  };
  Reply: {
    id: number;
    userId: number;
    title: string;
    price: string;
  }[];
}

export async function getTicketsRoutes(
  app: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: RouteShorthandOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 100 },
          offset: { type: 'integer', minimum: 0 },
        },
      },
      response: {
        200: {
          type: 'array',
          items: {
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
    },
    onRequest: [app.authenticate],
  };

  app.get<GetTickets>('/tickets', opts, async (req, res) => {
    const { limit, offset } = req.query;

    const tickets = await ticketModel.findAll(limit, offset);

    return tickets;
  });
}
