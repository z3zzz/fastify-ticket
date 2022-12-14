import { app } from '../app';
import { updateQuery } from './update-query';

export interface Id {
  id: number;
}

export interface TicketAttr {
  title: string;
  price: string;
  userId: string;
}

export interface UpdateTicketAttr {
  id: string;
  title?: string;
  price?: string;
}

export interface TicketData {
  id: number;
  userId: number;
  title: string;
  price: string;
  createdAt: string;
}

export class TicketModel {
  private DEFAULT_LIMIT = 20;
  private DEFAULT_OFFSET = 0;

  async findById(id: string): Promise<TicketData> {
    const { rows } = await app.pg.query<TicketData>(
      `
      SELECT *, user_id AS "userId", created_at AS "createdAt"
      FROM tickets 
      WHERE id = $1
    `,
      [id]
    );

    app.log.info(`ticket-findById: ${rows[0]?.id || 'not-found'}`);
    return rows[0];
  }

  async findByUserId(userId: string): Promise<TicketData> {
    const { rows } = await app.pg.query<TicketData>(
      `
      SELECT *, user_id AS "userId", created_at AS "createdAt"
      FROM tickets 
      WHERE user_id = $1
    `,
      [userId]
    );

    app.log.info(`ticket-findByUserId: ${rows[0]?.id || 'not-found'}`);
    return rows[0];
  }

  async create({
    title,
    price,
    userId,
  }: TicketAttr): Promise<{ isCreated: boolean; id: number }> {
    const { rows, rowCount } = await app.pg.query<Id>(
      `
      INSERT INTO tickets (title, price, user_id) 
      VALUES ($1, $2, $3)
      RETURNING id
    `,
      [title, price, userId]
    );

    app.log.info(
      `ticket-create: ${rowCount ? 'created' : 'not-created'}, ${title}`
    );

    const isCreated = rowCount === 1 ? true : false;

    return { isCreated, id: rows[0]?.id };
  }

  async findAll(
    limit: number = this.DEFAULT_LIMIT,
    offset: number = this.DEFAULT_OFFSET
  ): Promise<TicketData[]> {
    const { rows } = await app.pg.query<TicketData>(
      `
      SELECT *, user_id AS "userId", created_at AS "createdAt"
      FROM tickets 
      LIMIT $1
      OFFSET $2
    `,
      [limit, offset]
    );

    return rows;
  }

  async update({
    id,
    title,
    price,
  }: UpdateTicketAttr): Promise<{ isUpdated: boolean }> {
    const { rowCount } = await app.pg.query(updateQuery`
      title ${title ? title : ''}
      price ${price ? price : ''}
      id ${id}
    `);

    app.log.info(
      `ticket-update: ${rowCount ? 'updated' : 'not-updated'}, ${id}`
    );

    const isUpdated = rowCount === 1 ? true : false;

    return { isUpdated };
  }

  async deleteById(id: string): Promise<{ isDeleted: boolean }> {
    const { rowCount } = await app.pg.query(
      `
      DELETE FROM tickets  
      WHERE id = $1
    `,
      [id]
    );

    app.log.info(
      `ticket-delete: ${rowCount ? 'deleted' : 'not-deleted'}, ${id}`
    );

    const isDeleted = rowCount === 1 ? true : false;

    return { isDeleted };
  }

  async count(): Promise<number> {
    const { rows } = await app.pg.query<{ count: string }>(`
      SELECT COUNT(*) FROM tickets;
    `);

    return parseInt(rows[0].count);
  }
}

export const ticketModel = new TicketModel();
