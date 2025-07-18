import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasSearch, searchQuery, hasFilters }) => {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate('/note-editor');
  };

  if (hasSearch || hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No notes found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {hasSearch 
            ? `No notes match "${searchQuery}". Try adjusting your search terms or filters.`
            : "No notes match your current filters. Try adjusting your filter criteria."
          }
        </p>
        <div className="space-y-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Search & Filters
          </Button>
          <div className="text-sm text-muted-foreground">or</div>
          <Button onClick={handleCreateNote}>
            <Icon name="Plus" size={16} className="mr-2" />
            Create New Note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="FileText" size={32} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Secure Notes</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Create your first encrypted note to securely store your thoughts, passwords, and important information.
      </p>
      
      <Button onClick={handleCreateNote} size="lg">
        <Icon name="Plus" size={20} className="mr-2" />
        Create Your First Note
      </Button>

      {/* Onboarding Tips */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Shield" size={20} className="text-success" />
          </div>
          <h4 className="font-medium text-foreground mb-1">Secure & Encrypted</h4>
          <p className="text-sm text-muted-foreground">Your notes are encrypted end-to-end for maximum security</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Smartphone" size={20} className="text-primary" />
          </div>
          <h4 className="font-medium text-foreground mb-1">Cross-Device Sync</h4>
          <p className="text-sm text-muted-foreground">Access your notes from any device, anywhere</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Search" size={20} className="text-warning" />
          </div>
          <h4 className="font-medium text-foreground mb-1">Smart Organization</h4>
          <p className="text-sm text-muted-foreground">Categorize, tag, and search through your notes easily</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;