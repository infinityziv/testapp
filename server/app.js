const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

const bot = new Telegraf('6684068304:AAEL0MDab0FRXb--X4ECH2OdKLTJ2cZS7Cs');

// Обработчик команды /start
bot.start((ctx) => ctx.reply('Привет! Я бот Telegram.'));

// Обработчик команды /help
bot.help((ctx) => ctx.reply('Я могу отвечать на текстовые сообщения.'));

// Получение прогресса пользователя
app.post('/get-progress', (req, res) => {
    const { telegram_id } = req.body;
    const stmt = db.prepare('SELECT * FROM user_progress WHERE telegram_id = ?');
    const progress = stmt.get(telegram_id);

    if (progress) {
        res.json(progress);
    } else {
        res.json({
            telegram_id,
            balance: 0,
            next_open_time: 0,
            level: 1,
            cooldown: 4 * 60 * 60 * 1000,
            min_reward: 100,
            max_reward: 1000
        });
    }
});

// Сохранение прогресса пользователя
app.post('/save-progress', (req, res) => {
    const { telegram_id, balance, next_open_time, level, cooldown, min_reward, max_reward } = req.body;
    const stmt = db.prepare(`
        INSERT INTO user_progress (telegram_id, balance, next_open_time, level, cooldown, min_reward, max_reward)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(telegram_id) DO UPDATE SET
        balance = excluded.balance,
        next_open_time = excluded.next_open_time,
        level = excluded.level,
        cooldown = excluded.cooldown,
        min_reward = excluded.min_reward,
        max_reward = excluded.max_reward
    `);
    stmt.run(telegram_id, balance, next_open_time, level, cooldown, min_reward, max_reward);
    res.sendStatus(200);
});

// Запуск бота
bot.launch().then(() => {
    console.log('Бот успешно запущен');
}).catch((err) => {
    console.error('Ошибка запуска бота:', err);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
