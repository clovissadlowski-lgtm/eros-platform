import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL was not loaded for integration tests.',
  );
}

if (!databaseUrl.includes('higeia_test')) {
  throw new Error(
    'Integration tests must use the higeia_test database.',
  );
}