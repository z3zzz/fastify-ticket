/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE tickets (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      price VARCHAR(20) NOT NULL,
      user_id INTEGER NOT NULL, 
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE tickets;
  `);
};
