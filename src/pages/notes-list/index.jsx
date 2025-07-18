import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import SearchHeader from './components/SearchHeader';
import NotesGrid from './components/NotesGrid';
import FilterChips from './components/FilterChips';
import EmptyState from './components/EmptyState';
import BulkActions from './components/BulkActions';
import notesService from '../../utils/notesService';
import categoriesService from '../../utils/categoriesService';

const NotesList = () => {
  const { user } = useAuth();
  const location = useLocation();
  const selectedCategory = location.state?.selectedCategory;

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: selectedCategory?.id || null,
    privacy: null,
    encryption: null
  });
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Load notes and categories
  useEffect(() => {
    let isMounted = true;

    if (!user?.id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load notes with filters
        const filters = {
          categoryId: activeFilters.category,
          search: searchQuery,
          privacy: activeFilters.privacy
        };

        const [notesResult, categoriesResult] = await Promise.all([
          notesService.getNotes(user.id, filters),
          categoriesService.getCategories(user.id)
        ]);

        if (isMounted) {
          if (notesResult?.success) {
            setNotes(notesResult.data);
          } else {
            setError(notesResult?.error || 'Failed to load notes');
          }

          if (categoriesResult?.success) {
            setCategories(categoriesResult.data);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load data');
          console.log('Notes list error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, searchQuery, activeFilters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleNoteSelect = (noteId) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotes(notes.map(note => note.id));
  };

  const handleDeselectAll = () => {
    setSelectedNotes([]);
  };

  const handleBulkAction = async (action) => {
    if (!selectedNotes.length) return;

    try {
      switch (action) {
        case 'delete':
          await Promise.all(
            selectedNotes.map(noteId =>
              notesService.deleteNote(noteId, user.id)
            )
          );
          // Refresh notes list
          setNotes(prev => prev.filter(note => !selectedNotes.includes(note.id)));
          break;
        case 'archive':
          // Handle archive action
          break;
        case 'encrypt':
          // Handle encrypt action
          break;
        default:
          break;
      }
      
      setSelectedNotes([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.log('Bulk action error:', error);
    }
  };

  const headerActions = [
    {
      icon: 'Search',
      label: 'Search',
      onClick: () => {},
      variant: 'ghost'
    },
    {
      icon: 'Plus',
      label: 'New Note',
      onClick: () => window.location.href = '/note-editor',
      variant: 'default'
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:text-primary/80 transition-micro"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Search Header */}
      <SearchHeader 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedNotes.length}
        onToggleSelection={() => setIsSelectionMode(!isSelectionMode)}
      />

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <ContextualHeader
          title="Notes"
          subtitle={`${notes.length} notes`}
          rightActions={headerActions}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
        {/* Filters */}
        <FilterChips
          categories={categories}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />

        {/* Bulk Actions */}
        {isSelectionMode && selectedNotes.length > 0 && (
          <BulkActions
            selectedCount={selectedNotes.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkAction={handleBulkAction}
          />
        )}

        {/* Notes Grid */}
        {notes?.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            onClearFilters={() => {
              setSearchQuery('');
              setActiveFilters({
                category: null,
                privacy: null,
                encryption: null
              });
            }}
          />
        ) : (
          <NotesGrid
            notes={notes}
            selectedNotes={selectedNotes}
            isSelectionMode={isSelectionMode}
            onNoteSelect={handleNoteSelect}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomTabNavigation />

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default NotesList;