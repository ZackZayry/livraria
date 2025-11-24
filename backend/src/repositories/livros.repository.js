const Livro = require("../models/livro.model");
const fs = require("fs");
const path = require("path");
const RepositoryBase = require("./repository.interface");
const db = require("../database/sqlite");

class LivrosRepository{
    async findAll() {
        const rows = await db.all("SELECT id, titulo, autor, categoria, ano, pag, editora FROM livros ORDER BY id ASC");
        return rows.map(r => Livro.fromJSON(r));
    }

    async findById(id) {
        const row = await db.get("SELECT id, titulo, autor, categoria, ano, pag, editora FROM livros WHERE id = ?", [id]);
        return row ? Livro.fromJSON(row) : null;
    }

    async create(data) {
        const novo = new Livro({ id: null, ...data });
        const res = await db.run(
            "INSERT INTO livros (titulo, autor, categoria, ano, pag, editora) VALUES (?, ?, ?, ?, ?, ?)",
            [novo.titulo, novo.autor, novo.categoria, novo.ano, novo.pag, novo.editora]
        );
        return this.findById(res.id);
    }

    async update(id, data) {
        const atual = new Livro({id, ...data});
        await db.run(
            "UPDATE livros SET titulo = ?, autor = ?, categoria = ?, ano = ?, pag = ?, editora = ? WHERE id = ?",
            [atual.titulo, atual.autor, atual.categoria, atual.ano, atual.pag, atual.editora, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        const existente = await this.findById(id);
        if(!existente){
            const e = new Error("Livro não encontrado.");
            e.status = 404; throw e;
        }
        await db.run("DELETE FROM livros WHERE id = ?", [id]);
        return existente;
    }
}

module.exports = LivrosRepository;
