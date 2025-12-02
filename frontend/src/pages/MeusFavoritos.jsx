
import React, { useEffect, useState } from 'react';
import { favoritesService } from '../services/favoritesService';
import LivroCard from '../components/LivroCard';
import './Livros.css';

const MeusFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const res = await favoritesService.list();
    setFavoritos(res);
  };

  const handleToggleFavorite = async (livro) => {
    try {
      await favoritesService.remove(livro.id);
      setFavoritos(prev => prev.filter(l => l.id !== livro.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Meus Favoritos</h2>
      {favoritos.length === 0 && <p>Você não possui favoritos.</p>}
      <div className="livros-grid">
        {favoritos.map(livro => (
          <LivroCard key={livro.id} livro={livro} isFavorite={true} onToggleFavorite={handleToggleFavorite} />
        ))}
      </div>
    </div>
  );
};

export default MeusFavoritos;
