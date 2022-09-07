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

interface PostTicket {
  Body: {
    title: string;
    price: string;
  };
  Reply: {
    id: number;
    title: string;
    price: string;
  };
}

export async function postTicketRoutes(
  app: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: RouteShorthandOptions = {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 2, maxLength: 30 },
          price: { type: 'string', maxLength: 10 },
        },
        required: ['title', 'price'],
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string', minLength: 2, maxLength: 30 },
            price: { type: 'string', maxLength: 10 },
          },
        },
      },
    },
    onRequest: [app.authenticate],
  };

  app.post<PostTicket>('/ticket', opts, async (req, res) => {
    const currentUser = req.user as User;
    const { title, price } = req.body;

    const { id } = await ticketModel.create({
      title,
      price,
      userId: currentUser.id,
    });

    res.status(201);
    return { title, price, id };
  });
}
