import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import { NotFoundError } from '../errors';
import { ticketModel, UpdateTicketAttr } from '../models';

interface PatchTicket {
  Body: UpdateTicketAttr;
  Reply: {
    isUpdated: boolean;
  };
}

export async function patchTicketRoutes(
  app: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: RouteShorthandOptions = {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string', minLength: 2, maxLength: 30 },
          price: { type: 'string', maxLength: 10 },
        },
        anyOf: [{ required: ['id', 'title'] }, { required: ['id', 'price'] }],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            isUpdated: { type: 'boolean' },
          },
        },
      },
    },
    onRequest: [app.authenticate],
  };

  app.patch<PatchTicket>('/ticket', opts, async (req, res) => {
    const { id, title, price } = req.body;

    const { isUpdated } = await ticketModel.update({
      id,
      title,
      price,
    });

    if (!isUpdated) {
      throw new NotFoundError(
        `Ticket for id ${id} was not found, or not updated due to other reason.`
      );
    }

    return { isUpdated };
  });
}
