import React, { useState, useEffect } from 'react';
import { livrosService } from '../services/livrosService';
import LivroCard from '../components/LivroCard';
import { favoritesService } from '../services/favoritesService';
import LivroForm from '../components/LivroForm';
import './Livros.css';

const Livros = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLivro, setEditingLivro] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    carregarLivros();
    carregarFavoritos();
  }, []);

  const carregarLivros = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await livrosService.listar();
      const favData = await favoritesService.list();
      setLivros(data);
      setFavorites(favData.map(f => f.id)); 
    } catch (err) {
      setError('Erro ao carregar livros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLivro(null);
    setShowForm(true);
  };

  const handleEdit = (livro) => {
    setEditingLivro(livro);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este livro?')) {
      return;
    }

    try {
      await livrosService.remover(id);
      showSuccess('Livro removido com sucesso!');
      carregarLivros();
    } catch (err) {
      setError('Erro ao remover livro.');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingLivro) {
        await livrosService.atualizar(editingLivro.id, formData);
        showSuccess('Livro atualizado com sucesso!');
      } else {
        await livrosService.criar(formData);
        showSuccess('Livro criado com sucesso!');
      }
      setShowForm(false);
      setEditingLivro(null);
      carregarLivros();
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar livro.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLivro(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return <div className="loading">Carregando livros...</div>;
  }


  async function carregarFavoritos() {
    try {
      const favs = await favoritesService.list();
      setFavorites(favs.map(f => f.id));
    } catch (err) {
      console.error('Erro ao carregar favoritos', err);
    }
  }

   async function handleToggleFavorite(bookId) {
    if (favorites.includes(bookId)) {
      await favoritesService.remove(bookId);
      setFavorites(prev => prev.filter(id => id !== bookId));
    } else {
      await favoritesService.add(bookId);
      setFavorites(prev => [...prev, bookId]);
    }
  }

  const filteredBooks = showOnlyFavorites
    ? livros.filter(l => favorites.includes(l.id))
    : livros;

  return (
    <div className="container">
      <div className="livros-header">
        <h1>Meus Livros</h1>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Adicionar Livro
        </button>
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={{
            padding: "10px 20px",
            marginBottom: "20px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            backgroundColor: showOnlyFavorites ? "#ff4081" : "#1976d2",
            color: "white",
            transition: "0.3s"
          }}
        >
          {showOnlyFavorites ? "Mostrar Todos" : "Mostrar Apenas Favoritos"}
      </button>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {livros.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum livro cadastrado ainda.</p>
          <button onClick={handleCreate} className="btn btn-primary">
            Adicionar seu primeiro livro
          </button>
        </div>
      ) : (
        <div className="livros-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {filteredBooks.map(livro => (
          <LivroCard
            key={livro.id}
            livro={livro}
            isFavorite={favorites.includes(livro.id)}
            onToggleFavorite={() => handleToggleFavorite(livro.id)}
          />
        ))}
        </div>
      )}

      {showForm && (
        <LivroForm
          livro={editingLivro}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Livros;