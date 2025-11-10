import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: 'src/database/schema',
  out: 'src/database/drizzle',
  dbCredentials: {
    url:
      process.env.DATABASE_URL 
  },
} as Config;
