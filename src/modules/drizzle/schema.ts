import { serial, pgTable, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }).unique(),
  password: varchar('password', { length: 256 }),
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
