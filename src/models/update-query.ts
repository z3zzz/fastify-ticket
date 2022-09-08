import format from 'pg-format';

export function updateQuery(columns: TemplateStringsArray, ...keys: string[]) {
  if (!columns[0]) {
    throw new Error('At least one column should be specified');
  }

  if (columns.length !== keys.length + 1) {
    throw new Error('Number of columns and keys should be equal');
  }

  let query = 'UPDATE tickets ';

  let setFlag = false;

  for (const [i, v] of columns.entries()) {
    if (!v || !keys[i]) {
      continue;
    }

    if (trim(v) === 'id') {
      query += format('WHERE id = %L ', keys[i]);

      break;
    }

    query += setFlag
      ? format(`, ${trim(columns[i])} = %L `, keys[i])
      : format(`SET ${trim(columns[i])} = %L `, keys[i]);

    setFlag = true;
  }

  console.log(query);

  return query;
}

export function trim(target: string): string {
  return target.replace(/(\r\n|\n|\r)/gm, '').trim();
}
