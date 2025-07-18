import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import EditorHeader from './components/EditorHeader';
import FormattingToolbar from './components/FormattingToolbar';
import EditorContent from './components/EditorContent';
import CategorySelector from './components/CategorySelector';
import PrivacySettings from './components/PrivacySettings';
import ShareOptions from './components/ShareOptions';
import VersionHistory from './components/VersionHistory';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const NoteEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get note data from navigation state or create new note
  const existingNote = location.state?.note;
  const isNewNote = !existingNote;

  // Note state
  const [note, setNote] = useState({
    id: existingNote?.id || Date.now().toString(),
    title: existingNote?.title || '',
    content: existingNote?.content || '',
    category: existingNote?.category || '',
    privacyLevel: existingNote?.privacyLevel || 'private',
    isEncrypted: existingNote?.isEncrypted || false,
    createdAt: existingNote?.createdAt || new Date().toISOString(),
    updatedAt: existingNote?.updatedAt || new Date().toISOString()
  });

  // Editor state
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeFormats, setActiveFormats] = useState([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Sidebar state
  const [activeSidebar, setActiveSidebar] = useState(null); // category, privacy, share, history
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data
  const mockCategories = [
    { id: '1', name: 'Personal', color: '#3b82f6', noteCount: 12 },
    { id: '2', name: 'Work', color: '#10b981', noteCount: 8 },
    { id: '3', name: 'Ideas', color: '#f59e0b', noteCount: 5 },
    { id: '4', name: 'Passwords', color: '#ef4444', noteCount: 15 },
    { id: '5', name: 'Recipes', color: '#8b5cf6', noteCount: 3 }
  ];

  const mockVersions = [
    {
      id: 'v1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      isAutoSave: true,
      changes: 45
    },
    {
      id: 'v2',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      isManualSave: true,
      changes: 120
    },
    {
      id: 'v3',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isAutoSave: true,
      changes: 78
    }
  ];

  const mockShareLinks = [
    {
      id: 'link1',
      expiresIn: '7d',
      viewLimit: 10,
      viewsRemaining: 7,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSave(true);
      }, 30000); // Auto-save after 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges, note]);

  // Track changes
  useEffect(() => {
    if (existingNote) {
      const hasChanges = 
        note.title !== existingNote.title ||
        note.content !== existingNote.content ||
        note.category !== existingNote.category ||
        note.privacyLevel !== existingNote.privacyLevel ||
        note.isEncrypted !== existingNote.isEncrypted;
      
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(note.title.trim() !== '' || note.content.trim() !== '');
    }
  }, [note, existingNote]);

  // Handle save
  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!note.title.trim() && !note.content.trim()) return;

    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedNote = {
        ...note,
        updatedAt: new Date().toISOString()
      };
      
      setNote(updatedNote);
      setSaveStatus('saved');
      setLastSaved(new Date().toLocaleTimeString());
      setHasUnsavedChanges(false);
      
      // Store in localStorage for persistence
      const savedNotes = JSON.parse(localStorage.getItem('secretkeeper_notes') || '[]');
      const existingIndex = savedNotes.findIndex(n => n.id === updatedNote.id);
      
      if (existingIndex >= 0) {
        savedNotes[existingIndex] = updatedNote;
      } else {
        savedNotes.push(updatedNote);
      }
      
      localStorage.setItem('secretkeeper_notes', JSON.stringify(savedNotes));
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [note]);

  // Handle navigation with unsaved changes
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      navigate('/notes-list');
    }
  };

  // Handle content changes
  const handleTitleChange = (title) => {
    setNote(prev => ({ ...prev, title }));
  };

  const handleContentChange = (content) => {
    setNote(prev => ({ ...prev, content }));
  };

  const handleCategoryChange = (categoryId) => {
    setNote(prev => ({ ...prev, category: categoryId }));
  };

  const handlePrivacyChange = (privacyLevel) => {
    setNote(prev => ({ ...prev, privacyLevel }));
  };

  const handleEncryptionToggle = (isEncrypted) => {
    setNote(prev => ({ ...prev, isEncrypted }));
  };

  // Formatting functions
  const handleFormat = (formatType) => {
    // Simple formatting implementation
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = note.content.substring(start, end);
    
    let formattedText = selectedText;
    
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
    }
    
    const newContent = 
      note.content.substring(0, start) + 
      formattedText + 
      note.content.substring(end);
    
    handleContentChange(newContent);
  };

  const handleInsert = (insertType) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    let insertText = '';
    
    switch (insertType) {
      case 'heading':
        insertText = '# ';
        break;
      case 'list':
        insertText = '- ';
        break;
      case 'listOrdered':
        insertText = '1. ';
        break;
      case 'code':
        insertText = '```\n\n```';
        break;
      case 'quote':
        insertText = '> ';
        break;
      case 'link':
        insertText = '[Link text](URL)';
        break;
    }
    
    const newContent = 
      note.content.substring(0, start) + 
      insertText + 
      note.content.substring(start);
    
    handleContentChange(newContent);
  };

  // Sidebar functions
  const toggleSidebar = (sidebarType) => {
    if (activeSidebar === sidebarType && isSidebarOpen) {
      setIsSidebarOpen(false);
      setActiveSidebar(null);
    } else {
      setActiveSidebar(sidebarType);
      setIsSidebarOpen(true);
    }
  };

  const renderSidebarContent = () => {
    switch (activeSidebar) {
      case 'category':
        return (
          <CategorySelector
            selectedCategory={note.category}
            onCategoryChange={handleCategoryChange}
            categories={mockCategories}
            onCreateCategory={(newCategory) => {
              // Handle new category creation
              console.log('New category:', newCategory);
            }}
          />
        );
      case 'privacy':
        return (
          <PrivacySettings
            privacyLevel={note.privacyLevel}
            onPrivacyChange={handlePrivacyChange}
            isEncrypted={note.isEncrypted}
            onEncryptionToggle={handleEncryptionToggle}
          />
        );
      case 'share':
        return (
          <ShareOptions
            noteId={note.id}
            onGenerateLink={(linkData) => {
              console.log('Generate link:', linkData);
            }}
            onCopyLink={(link) => {
              navigator.clipboard.writeText(`https://secretkeeper.app/shared/${link.id}`);
            }}
            existingLinks={mockShareLinks}
          />
        );
      case 'history':
        return (
          <VersionHistory
            versions={mockVersions}
            onRestoreVersion={(version) => {
              console.log('Restore version:', version);
            }}
            onViewVersion={(version) => {
              console.log('View version:', version);
            }}
            currentVersion={{ id: 'current' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="lg:pl-64">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <EditorHeader
            noteTitle={note.title}
            onTitleChange={handleTitleChange}
            saveStatus={saveStatus}
            lastSaved={lastSaved}
            onBack={handleBack}
            onSave={() => handleSave(false)}
            hasUnsavedChanges={hasUnsavedChanges}
          />

          {/* Breadcrumb */}
          <div className="px-4 lg:px-6 py-2 border-b border-border">
            <NavigationBreadcrumb
              customBreadcrumbs={[
                { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
                { label: 'Notes', path: '/notes-list', icon: 'FileText' },
                { label: note.title || 'New Note', path: '/note-editor', icon: 'Edit' }
              ]}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Area */}
            <div className="flex-1 flex flex-col">
              {/* Desktop Toolbar */}
              <div className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={activeSidebar === 'category' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleSidebar('category')}
                    iconName="Tag"
                    iconPosition="left"
                  >
                    Category
                  </Button>
                  <Button
                    variant={activeSidebar === 'privacy' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleSidebar('privacy')}
                    iconName="Shield"
                    iconPosition="left"
                  >
                    Privacy
                  </Button>
                  <Button
                    variant={activeSidebar === 'share' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleSidebar('share')}
                    iconName="Share"
                    iconPosition="left"
                  >
                    Share
                  </Button>
                  <Button
                    variant={activeSidebar === 'history' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleSidebar('history')}
                    iconName="History"
                    iconPosition="left"
                  >
                    History
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {note.content.length} chars, {note.content.trim() ? note.content.trim().split(/\s+/).length : 0} words
                  </span>
                </div>
              </div>

              {/* Editor Content */}
              <EditorContent
                content={note.content}
                onContentChange={handleContentChange}
                placeholder="Start writing your secure note..."
                isPreviewMode={isPreviewMode}
                onSelectionChange={setSelection}
              />

              {/* Formatting Toolbar */}
              <FormattingToolbar
                onFormat={handleFormat}
                activeFormats={activeFormats}
                onInsert={handleInsert}
                isPreviewMode={isPreviewMode}
                onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
              />
            </div>

            {/* Desktop Sidebar */}
            {isSidebarOpen && (
              <div className="hidden lg:block w-80 border-l border-border bg-card overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground capitalize">
                      {activeSidebar}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                      className="h-8 w-8"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                  {renderSidebarContent()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground capitalize">
                  {activeSidebar}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Action Buttons */}
      <div className="lg:hidden fixed bottom-20 right-4 flex flex-col space-y-2">
        <Button
          variant="default"
          size="icon"
          onClick={() => toggleSidebar('category')}
          className="h-12 w-12 rounded-full shadow-elevation-2"
        >
          <Icon name="Tag" size={20} />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={() => toggleSidebar('privacy')}
          className="h-12 w-12 rounded-full shadow-elevation-2"
        >
          <Icon name="Shield" size={20} />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={() => toggleSidebar('share')}
          className="h-12 w-12 rounded-full shadow-elevation-2"
        >
          <Icon name="Share" size={20} />
        </Button>
      </div>

      {/* Unsaved Changes Dialog */}
      {showUnsavedDialog && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-elevation-3">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning" />
              <h3 className="text-lg font-semibold text-foreground">Unsaved Changes</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              You have unsaved changes that will be lost if you leave. Do you want to save your note before leaving?
            </p>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                onClick={async () => {
                  await handleSave(false);
                  navigate('/notes-list');
                }}
                iconName="Save"
                iconPosition="left"
              >
                Save & Leave
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/notes-list')}
              >
                Leave Without Saving
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowUnsavedDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default NoteEditor;