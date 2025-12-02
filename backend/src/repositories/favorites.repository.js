
const db = require("../database/sqlite");

class FavoritesRepository {
    constructor() {}

    add(userId, bookId) {
        const stmt = db.run("INSERT OR IGNORE INTO favorites (user_id, book_id) VALUES (?, ?)", [userId, bookId]);
        // Check if inserted by fetching row
        return db.get("SELECT id, user_id, book_id, created_at FROM favorites WHERE user_id = ? AND book_id = ?", [userId, bookId]);
    }

    remove(userId, bookId) {
        const info = db.run("DELETE FROM favorites WHERE user_id = ? AND book_id = ?", [userId, bookId]);
        return info.changes > 0;
    }

    listByUser(userId) {
        const rows = db.all(
            `SELECT l.id, l.titulo, l.autor, l.categoria, l.ano, l.editora
             FROM livros l
             INNER JOIN favorites f ON l.id = f.book_id
             WHERE f.user_id = ?`, [userId]
        );
        return rows;
    }

    exists(userId, bookId) {
        return !!db.get("SELECT 1 FROM favorites WHERE user_id = ? AND book_id = ?", [userId, bookId]);
    }
}

module.exports = FavoritesRepository;
