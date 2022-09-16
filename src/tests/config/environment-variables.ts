import { POSTGRES_URL, JWT_SECRET_KEY, COOKIE_KEY } from '../../constants';

// Set database name to "<currentDatabase>_test"
export const POSTGRES_TEST_URL_ADMIN = `${POSTGRES_URL}_test`;

// Essential envs check
if (!JWT_SECRET_KEY) {
  console.error('JWT_SECRET_KEY environment variable is not provided');
  process.exit(1);
}

if (!COOKIE_KEY) {
  console.error('COOKIE_KEY environment variable is not provided');
  process.exit(1);
}
