import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NoteCard = ({ note, onDelete, onToggleFavorite, isSelected, onToggleSelect, selectionMode }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/note-editor', { state: { noteId: note.id } });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(note.id);
  };

  const handleCardClick = () => {
    if (selectionMode) {
      onToggleSelect(note.id);
    } else {
      handleEdit();
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Personal': 'bg-blue-100 text-blue-800',
      'Work': 'bg-green-100 text-green-800',
      'Ideas': 'bg-purple-100 text-purple-800',
      'Passwords': 'bg-red-100 text-red-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Health': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-elevation-2 ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {selectionMode && (
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              isSelected ? 'bg-primary border-primary' : 'border-border'
            }`}>
              {isSelected && <Icon name="Check" size={12} className="text-primary-foreground" />}
            </div>
          )}
          <h3 className="font-semibold text-foreground truncate">{note.title}</h3>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="w-8 h-8 opacity-60 hover:opacity-100"
          >
            <Icon 
              name={note.isFavorite ? "Heart" : "Heart"} 
              size={16} 
              className={note.isFavorite ? "text-red-500 fill-current" : "text-muted-foreground"} 
            />
          </Button>
          
          {!selectionMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="w-8 h-8 opacity-60 hover:opacity-100 hover:text-destructive"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {note.content.length > 120 ? `${note.content.substring(0, 120)}...` : note.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
            {note.category}
          </span>
          {note.isEncrypted && (
            <Icon name="Lock" size={12} className="text-muted-foreground" />
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          {formatDate(note.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;