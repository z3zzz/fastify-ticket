import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import { NotFoundError } from '../errors';
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

    if (!isDeleted) {
      throw new NotFoundError(
        `Ticket for id ${id} was not found, or not deleted due to other reason.`
      );
    }

    res.status(200);
    return { isDeleted };
  });
}
