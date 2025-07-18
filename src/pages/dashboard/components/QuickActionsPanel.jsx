import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ categories }) => {
  const navigate = useNavigate();

  const handleCreateNote = (category = null) => {
    navigate('/note-editor', { state: { category } });
  };

  const quickActions = [
    {
      id: 'new-note',
      label: 'Create New Note',
      icon: 'Plus',
      variant: 'default',
      onClick: () => handleCreateNote(),
      primary: true
    },
    {
      id: 'quick-personal',
      label: 'Personal Note',
      icon: 'User',
      variant: 'outline',
      onClick: () => handleCreateNote('Personal')
    },
    {
      id: 'quick-work',
      label: 'Work Note',
      icon: 'Briefcase',
      variant: 'outline',
      onClick: () => handleCreateNote('Work')
    },
    {
      id: 'quick-finance',
      label: 'Finance Note',
      icon: 'DollarSign',
      variant: 'outline',
      onClick: () => handleCreateNote('Finance')
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.onClick}
            className={`h-auto p-4 flex-col space-y-2 ${action.primary ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          >
            <Icon name={action.icon} size={24} />
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-20 right-4 lg:hidden z-50">
        <Button
          variant="default"
          size="icon"
          onClick={() => handleCreateNote()}
          className="w-14 h-14 rounded-full shadow-elevation-3 bg-primary hover:bg-primary/90"
        >
          <Icon name="Plus" size={24} />
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsPanel;