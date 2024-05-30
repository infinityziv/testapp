const Database = require('better-sqlite3');
const db = new Database('progress.db', { verbose: console.log });

// Создаем таблицу для хранения прогресса пользователей, если она еще не существует
db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
        telegram_id INTEGER PRIMARY KEY,
        balance INTEGER,
        next_open_time INTEGER,
        level INTEGER,
        cooldown INTEGER,
        min_reward INTEGER,
        max_reward INTEGER
    )
`);

module.exports = db;
