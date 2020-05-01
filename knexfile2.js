module.exports = {
  development: {
    client: 'pg',
    connection: '',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/monikers_test',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: {
        host: 'ec2-54-247-89-181.eu-west-1.compute.amazonaws.com',
        port: '5432',
        user: 'sxnyqzmvxsaxmr',
        password: '3e5846293e05cbc50ed4227f8ce0b88f12df2bef150b323831f846b3e19c9a5d',
        database: 'd3oqc4ac068n31',
        ssl: {
            rejectUnauthorized: false
        }
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
