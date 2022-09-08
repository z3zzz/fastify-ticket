import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import { ticketModel } from '../models';

interface DeleteTicket {
  Querystring: {
    id: string;
  };
  Reply: {
    isDeleted: boolean;
  };
}

export async function deleteTicketRoutes(
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
            isDeleted: { type: 'boolean' },
          },
        },
      },
    },
    onRequest: [app.authenticate],
  };

  app.delete<DeleteTicket>('/ticket', opts, async (req, res) => {
    const { id } = req.query;

    const { isDeleted } = await ticketModel.deleteById(id);

    res.status(200);
    return { isDeleted };
  });
}
