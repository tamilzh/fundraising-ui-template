import { Level } from 'level'

// Create a database
const db = new Level(`/tmp/artist-site${process.env.APP_SITE_ID}-db`, { valueEncoding: 'json' })

export default db;