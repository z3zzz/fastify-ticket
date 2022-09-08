import format from 'pg-format';
import { trim } from './update-query';

export function cleanupQuery(columns: TemplateStringsArray, ...keys: string[]) {
  if (!columns[0]) {
    throw new Error('At least one column should be specified');
  }

  if (columns.length !== keys.length + 1) {
    throw new Error('Number of columns and keys should be equal');
  }

  let query = format(
    'DELETE FROM tickets WHERE %I = %L ',
    trim(columns[0]),
    keys[0]
  );

  for (const [i, v] of columns.entries()) {
    if (!i || !v) {
      continue;
    }

    query += format('OR %I = %L ', trim(columns[0]), keys[i]);
  }

  console.log(query);

  return query;
}
