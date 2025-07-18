import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentNotesSection = ({ recentNotes = [] }) => {
  const navigate = useNavigate();

  const handleNoteClick = (note) => {
    navigate('/note-editor', { state: { note } });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const getCategoryColor = (category) => {
    if (!category) return '#6b7280';
    return category.color || '#6b7280';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Notes</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/notes-list')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>

      {recentNotes?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No notes yet</p>
          <Button
            variant="default"
            onClick={() => navigate('/note-editor')}
            iconName="Plus"
            iconPosition="left"
          >
            Create Your First Note
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNoteClick(note)}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-micro group"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-micro">
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.is_encrypted && (
                      <Icon name="Lock" size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {truncateContent(note.content)}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    {note.categories && (
                      <div className="flex items-center space-x-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(note.categories) }}
                        />
                        <span>{note.categories.name}</span>
                      </div>
                    )}
                    <span>•</span>
                    <span>{formatDate(note.updated_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {note.privacy_level === 'shared' && (
                    <Icon name="Share" size={14} className="text-muted-foreground" />
                  )}
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-micro" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentNotesSection;