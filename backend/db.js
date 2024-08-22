const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'postgres',
  port: 5432,
})

// const pool = new Pool({
//     user: 'postgres.ahabfpgionnvjyqykiaf',
//     host: 'aws-0-us-east-1.pooler.supabase.com',
//     database: 'postgres',
//     password: 'Yavgesh@123',
//     port: 6543,
//   })

module.exports={pool}