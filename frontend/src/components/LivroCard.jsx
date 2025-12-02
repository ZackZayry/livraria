import React from 'react';
import './LivroCard.css';

const LivroCard = ({ livro, onEdit, onDelete, isFavorite = false, onToggleFavorite }) => {
  return (
    <div className="livro-card">      
      <h3>{livro.titulo}</h3>
      <p><strong>Autor:</strong> {livro.autor}</p>
      <p><strong>Ano:</strong> {livro.ano}</p>
      {livro.editora && <p><strong>Editora:</strong> {livro.editora}</p>}
      
      <div className="card-actions">
        <button
        onClick={onToggleFavorite}
        style={{
          marginTop: "10px",
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: isFavorite ? "#ff4081" : "#eeeeee",
          color: isFavorite ? "white" : "#333",
          transition: "0.3s",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            transform: isFavorite ? "scale(1.3)" : "scale(1)",
            transition: "0.2s",
          }}
        >
          {isFavorite ? "💖" : "🤍"}
        </span>

        {isFavorite ? "Desfavoritar" : "Favoritar"}
      </button>
        <button onClick={() => onEdit(livro)} className="btn btn-primary">
          ✏️ Editar
        </button>
        <button onClick={() => onDelete(livro.id)} className="btn btn-danger">
          🗑️ Remover
        </button>
      </div>
    </div>
  );
};

export default LivroCard;