import { randomBytes } from 'crypto';
import format from 'pg-format';
import migrate from 'node-pg-migrate';
import fastifyPostgres from '@fastify/postgres';
import { POSTGRES_TEST_URL_ADMIN } from './environment-variables';
import { app } from '../../app';

// default user info for auth
export const TESTER = {
  email: 'signin@example.com',
  id: 100,
  cookie:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJlbWFpbCI6InNpZ25pbkBleGFtcGxlLmNvbSIsImlhdCI6MTY2MDYzODg1N30.oqZn8yAe0Nx7Q4tD8p5E66o13w1pH89PHkCSQf3zkho.2xZgvMf1uw3z6N28WoffzkFdbAe2hTODTexiGrpsH+Y',
};

// default ticket info
export const TICKET = {
  title: 'test-ticket',
  price: '494410',
};

export class Context {
  static async build(): Promise<Context> {
    // create random string
    const roleName = 'a' + randomBytes(4).toString('hex');
    const POSTGRES_TEST_URL = `postgresql://${roleName}:${roleName}@${
      POSTGRES_TEST_URL_ADMIN.split('@')[1]
    }`;

    // register default pg opt as admin
    app.register(fastifyPostgres, {
      connectionString: POSTGRES_TEST_URL_ADMIN,
      name: 'admin',
    });
    // register pg with random user opt as default (no name)
    app.register(fastifyPostgres, {
      connectionString: POSTGRES_TEST_URL,
    });

    // bootstrap all plugins
    await app.inject({ url: '/' });

    // connect to pool with admin
    try {
      await app.pg.admin.connect();
    } catch (e: any) {
      console.error(e.message);
      process.exit(1); // postgres connection failed
      // 1) postgres server is not running, or
      // 2) connection url is wrong
    }

    // create user
    await app.pg.admin.query(
      format('CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName)
    );

    // create schema
    await app.pg.admin.query(
      format('CREATE SCHEMA %I AUTHORIZATION %I;', roleName, roleName)
    );

    // migrate up for the schema
    await migrate({
      schema: roleName,
      direction: 'up',
      noLock: true,
      dir: 'migrations',
      databaseUrl: POSTGRES_TEST_URL,
      migrationsTable: 'pgmigrations',
      log: () => {},
    });

    // connect to pool with created user
    await app.pg.connect();

    return new Context(roleName);
  }

  constructor(private roleName: string) {}

  async reset(table: string): Promise<void> {
    // delete rows from table
    await app.pg.query(format('DELETE FROM %I', table));
  }

  async clean(): Promise<void> {
    // delete schema
    await app.pg.admin.query(format('DROP SCHEMA %I CASCADE', this.roleName));
    // delete user
    await app.pg.admin.query(format('DROP ROLE %I', this.roleName));
  }
}

export async function createTicket(title?: string) {
  const res = await app.inject({
    method: 'POST',
    url: '/ticket',
    payload: title
      ? {
          ...TICKET,
          title,
        }
      : TICKET,
    cookies: { token: TESTER.cookie },
  });

  const body = JSON.parse(res.body);

  return body.id;
}
