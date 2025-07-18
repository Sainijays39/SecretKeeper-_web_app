import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import WelcomeSection from './components/WelcomeSection';
import RecentNotesSection from './components/RecentNotesSection';
import QuickActionsPanel from './components/QuickActionsPanel';
import StatisticsWidget from './components/StatisticsWidget';
import SearchHeader from './components/SearchHeader';
import CategoriesSidebar from './components/CategoriesSidebar';
import notesService from '../../utils/notesService';
import categoriesService from '../../utils/categoriesService';

const Dashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState({
    totalNotes: 0,
    categoriesUsed: 0,
    encryptedNotes: 0,
    storageUsed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    let isMounted = true;
    
    if (!user?.id || authLoading) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load recent notes
        const notesResult = await notesService.getRecentNotes(user.id, 5);
        if (notesResult?.success && isMounted) {
          setRecentNotes(notesResult.data);
        }

        // Load categories
        const categoriesResult = await categoriesService.getCategories(user.id);
        if (categoriesResult?.success && isMounted) {
          setCategories(categoriesResult.data);
        }

        // Load statistics
        const statsResult = await notesService.getNotesStats(user.id);
        if (statsResult?.success && isMounted) {
          setStatistics({
            totalNotes: statsResult.data.totalNotes,
            categoriesUsed: categoriesResult?.data?.length || 0,
            encryptedNotes: statsResult.data.encryptedNotes,
            storageUsed: Math.round((statsResult.data.totalNotes * 2.5)) // Approximate KB
          });
        }

      } catch (error) {
        if (isMounted) {
          setError('Failed to load dashboard data');
          console.log('Dashboard error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // In a real app, this would trigger a search and navigate to notes list
    console.log('Searching for:', query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // In a real app, this would filter notes by category
    console.log('Selected category:', category);
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
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

  // Header actions for desktop
  const headerActions = [
    {
      icon: 'Search',
      label: 'Search',
      onClick: () => handleSearch(''),
      variant: 'ghost'
    },
    {
      icon: 'Plus',
      label: 'New Note',
      onClick: () => window.location.href = '/note-editor',
      variant: 'default'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Search Header */}
      <SearchHeader 
        onSearch={handleSearch} 
        userName={userProfile?.display_name || userProfile?.full_name || 'User'} 
      />

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <ContextualHeader
          title="Dashboard"
          subtitle="Overview and quick actions"
          rightActions={headerActions}
        />
      </div>

      <div className="flex">
        {/* Desktop Categories Sidebar */}
        <CategoriesSidebar
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
            {/* Breadcrumb Navigation */}
            <NavigationBreadcrumb />

            {/* Welcome Section */}
            <WelcomeSection
              userName={userProfile?.display_name || userProfile?.full_name || 'User'}
              securityStatus="secure"
            />

            {/* Desktop Grid Layout */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-6">
              {/* Left Column - Recent Notes */}
              <div className="lg:col-span-2">
                <RecentNotesSection recentNotes={recentNotes} />
              </div>

              {/* Right Column - Statistics and Quick Actions */}
              <div className="lg:col-span-1">
                <StatisticsWidget stats={statistics} />
                <div className="hidden lg:block">
                  <QuickActionsPanel categories={categories} />
                </div>
              </div>
            </div>

            {/* Mobile Quick Actions */}
            <div className="lg:hidden">
              <QuickActionsPanel categories={categories} />
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation />

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default Dashboard;