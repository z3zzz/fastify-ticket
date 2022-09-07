export const initialQuery = `
  CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    price VARCHAR(20),
    user_id INTEGER, 
    created_at TIMESTAMP DEFAULT Now()
  );
`;
