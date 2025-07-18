import { supabase } from './supabase';

const notesService = {
  // Get all notes for current user
  async getNotes(userId, filters = {}) {
    try {
      let query = supabase
        .from('notes')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      // Apply filters
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }
      
      if (filters?.privacy) {
        query = query.eq('privacy_level', filters.privacy);
      }

      const { data, error } = await query;
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load notes' };
    }
  },

  // Get recent notes
  async getRecentNotes(userId, limit = 5) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load recent notes' };
    }
  },

  // Get single note
  async getNote(noteId, userId) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('id', noteId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load note' };
    }
  },

  // Create new note
  async createNote(userId, noteData) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: userId,
          title: noteData.title,
          content: noteData.content,
          category_id: noteData.categoryId,
          privacy_level: noteData.privacyLevel || 'private',
          is_encrypted: noteData.isEncrypted || false,
          tags: noteData.tags || []
        }])
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to create note' };
    }
  },

  // Update note
  async updateNote(noteId, userId, updates) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', noteId)
        .eq('user_id', userId)
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to update note' };
    }
  },

  // Delete note (soft delete)
  async deleteNote(noteId, userId) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ status: 'deleted' })
        .eq('id', noteId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to delete note' };
    }
  },

  // Get notes statistics
  async getNotesStats(userId) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id, privacy_level, is_encrypted, category_id')
        .eq('user_id', userId)
        .eq('status', 'active');
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      const stats = {
        totalNotes: data?.length || 0,
        encryptedNotes: data?.filter(note => note.is_encrypted).length || 0,
        categorizedNotes: data?.filter(note => note.category_id).length || 0,
        privateNotes: data?.filter(note => note.privacy_level === 'private').length || 0
      };
      
      return { success: true, data: stats };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load statistics' };
    }
  },

  // Search notes
  async searchNotes(userId, searchQuery) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('updated_at', { ascending: false });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to search notes' };
    }
  }
};

export default notesService;