-- SecretKeeper Database Schema with Authentication
-- Location: supabase/migrations/20250111035146_secretkeeper_with_auth.sql

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.note_privacy AS ENUM ('private', 'protected', 'shared');
CREATE TYPE public.note_status AS ENUM ('active', 'archived', 'deleted');

-- 2. User Profiles Table (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    display_name TEXT,
    role public.user_role DEFAULT 'user'::public.user_role,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    icon TEXT DEFAULT 'Tag',
    note_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Notes Table
CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    privacy_level public.note_privacy DEFAULT 'private'::public.note_privacy,
    status public.note_status DEFAULT 'active'::public.note_status,
    is_encrypted BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Share Links Table
CREATE TABLE public.share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    link_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ,
    view_limit INTEGER,
    view_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_category_id ON public.notes(category_id);
CREATE INDEX idx_notes_status ON public.notes(status);
CREATE INDEX idx_notes_created_at ON public.notes(created_at);
CREATE INDEX idx_share_links_note_id ON public.share_links(note_id);
CREATE INDEX idx_share_links_token ON public.share_links(link_token);

-- 7. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;

-- 8. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.owns_note(note_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.notes n
    WHERE n.id = note_uuid AND n.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_category(category_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.categories c
    WHERE c.id = category_uuid AND c.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_shared_note(note_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.notes n
    WHERE n.id = note_uuid AND (
        n.user_id = auth.uid() OR
        n.privacy_level = 'shared'::public.note_privacy
    )
)
$$;

-- 9. Trigger Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, display_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_category_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.categories
        SET note_count = note_count + 1
        WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.categories
        SET note_count = note_count - 1
        WHERE id = OLD.category_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
        UPDATE public.categories
        SET note_count = note_count - 1
        WHERE id = OLD.category_id;
        
        UPDATE public.categories
        SET note_count = note_count + 1
        WHERE id = NEW.category_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 10. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_user_profiles_updated
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_categories_updated
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_notes_updated
    BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_notes_category_count
    AFTER INSERT OR UPDATE OR DELETE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION public.update_category_count();

-- 11. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_manage_own_categories" ON public.categories FOR ALL
USING (public.owns_category(id) OR public.is_admin())
WITH CHECK (public.owns_category(id) OR public.is_admin());

CREATE POLICY "users_manage_own_notes" ON public.notes FOR ALL
USING (public.owns_note(id) OR public.is_admin())
WITH CHECK (public.owns_note(id) OR public.is_admin());

CREATE POLICY "public_can_view_shared_notes" ON public.notes FOR SELECT
USING (public.can_access_shared_note(id));

CREATE POLICY "users_manage_own_share_links" ON public.share_links FOR ALL
USING (user_id = auth.uid() OR public.is_admin())
WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- 12. Complete Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    category1_uuid UUID := gen_random_uuid();
    category2_uuid UUID := gen_random_uuid();
    category3_uuid UUID := gen_random_uuid();
    note1_uuid UUID := gen_random_uuid();
    note2_uuid UUID := gen_random_uuid();
    note3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@secretkeeper.com', crypt('SecurePass123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "display_name": "Admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@secretkeeper.com', crypt('SecurePass123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Johnson", "display_name": "Alex"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create categories
    INSERT INTO public.categories (id, user_id, name, color, icon, note_count) VALUES
        (category1_uuid, user_uuid, 'Personal', '#3b82f6', 'User', 0),
        (category2_uuid, user_uuid, 'Work', '#10b981', 'Briefcase', 0),
        (category3_uuid, user_uuid, 'Passwords', '#ef4444', 'Lock', 0);

    -- Create notes
    INSERT INTO public.notes (id, user_id, category_id, title, content, privacy_level, is_encrypted, tags) VALUES
        (note1_uuid, user_uuid, category1_uuid, 'Meeting Notes - Q4 Planning', 
         'Discussed quarterly goals, budget allocation, and team restructuring. Key decisions made regarding project priorities and resource allocation for the upcoming quarter.', 
         'private'::public.note_privacy, true, '{"meeting", "planning", "q4"}'),
        (note2_uuid, user_uuid, category2_uuid, 'Investment Portfolio Review', 
         'Current portfolio performance analysis. Need to rebalance allocation between stocks and bonds. Consider increasing international exposure and reducing tech sector concentration.', 
         'private'::public.note_privacy, true, '{"finance", "investment", "portfolio"}'),
        (note3_uuid, user_uuid, category3_uuid, 'Bank Account Passwords', 
         'Main Bank: username: alexj2024, password: [REDACTED]\nSavings Account: username: alex.johnson, password: [REDACTED]', 
         'private'::public.note_privacy, true, '{"passwords", "banking", "sensitive"}');

    -- Update category counts (trigger should handle this automatically)
    UPDATE public.categories 
    SET note_count = (SELECT COUNT(*) FROM public.notes WHERE category_id = categories.id)
    WHERE user_id = user_uuid;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 13. Cleanup Function
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@secretkeeper.com';

    -- Delete in dependency order (children first)
    DELETE FROM public.share_links WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.notes WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.categories WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;