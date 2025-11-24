const db = require('../database/sqlite');
const User = require('../models/user.model');

class UsersRepository {
  async findById(id) {
    const row = await db.get('SELECT id, username, email, nomeCompleto, created_at FROM users WHERE id = ?', [id]);
    return row ? User.fromDB(row) : null;
  }

  async findByUsername(username) {
    const row = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    return row || null;
  }

  async findByEmail(email) {
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return row || null;
  }

  async create({ username, email, nomeCompleto, passwordHash }) {
    const result = await db.run(
      'INSERT INTO users (username, email, nomeCompleto, password_hash) VALUES (?, ?, ?, ?)',
      [username, email, nomeCompleto, passwordHash]
    );

    const row = await db.get('SELECT id, username, email, nomeCompleto, created_at FROM users WHERE id = ?', [result.lastInsertRowid]);
    return User.fromDB(row);
  }
}

module.exports = UsersRepository;
