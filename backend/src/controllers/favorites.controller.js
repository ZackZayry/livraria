
const FavoritesRepository = require("../repositories/favorites.repository");
const LivrosRepository = require("../repositories/livros.repository");

class FavoritesController {
    constructor() {
        this.favRepo = new FavoritesRepository();
        this.livrosRepo = new LivrosRepository();
    }

    async listUserFavorites(req, res, next) {
        try {
            const userId = req.session.userId;
            const favoritos = await this.favRepo.listByUser(userId);
            res.status(200).json(favoritos);
        } catch (err) {
            next(err);
        }
    }

    async addFavorite(req, res, next) {
        try {
            const userId = req.session.userId;
            const { book_id } = req.body;
            if (!book_id) return res.status(400).json({ erro: 'book_id é obrigatório' });
            // check book exists
            const livro = await this.livrosRepo.findById(parseInt(book_id));
            if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
            const fav = this.favRepo.add(userId, livro.id);
            res.status(201).json(fav);
        } catch (err) {
            next(err);
        }
    }

    async removeFavorite(req, res, next) {
        try {
            const userId = req.session.userId;
            const bookId = parseInt(req.params.bookId);
            const removed = this.favRepo.remove(userId, bookId);
            if (!removed) return res.status(404).json({ mensagem: 'Favorito não encontrado' });
            res.status(200).json({ mensagem: 'Removido' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = FavoritesController;
