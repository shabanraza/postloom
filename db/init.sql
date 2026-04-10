-- Postloom database schema
-- Free tweet card generator mode does not require any application tables.
-- Keep this file as an explicit no-op placeholder for future schema work.
-- Postloom Database Schema
-- This schema extends the neon_auth schema for user management

-- ============================================
-- Social Accounts (connected X, LinkedIn, Threads)
-- ============================================
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- References neon_auth.users(id) when auth is enabled
  platform TEXT NOT NULL CHECK (platform IN ('x', 'linkedin', 'threads', 'instagram')),
  platform_user_id TEXT NOT NULL,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, platform_user_id)
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);

-- ============================================
-- Drafts (saved posts not yet published)
-- ============================================
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  media_urls TEXT[],
  platforms TEXT[], -- target platforms: ['x', 'linkedin', 'threads']
  metadata JSONB DEFAULT '{}', -- platform-specific settings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON drafts(updated_at DESC);

-- ============================================
-- Templates (reusable post templates)
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[], -- e.g., ['{{topic}}', '{{link}}']
  category TEXT,
  is_default BOOLEAN DEFAULT FALSE, -- system templates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);

-- ============================================
-- Scheduled Posts (posts queued for publishing)
-- ============================================
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  social_account_ids UUID[] NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_for TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for);

-- ============================================
-- Posts (published posts)
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  social_account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
  scheduled_post_id UUID REFERENCES scheduled_posts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'linkedin', 'threads', 'instagram')),
  platform_post_id TEXT, -- ID from the platform (tweet_id, etc.)
  platform_post_url TEXT, -- URL to the post on the platform
  content TEXT NOT NULL,
  media_urls TEXT[],
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'failed', 'deleted')),
  published_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}', -- platform-specific data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_social_account_id ON posts(social_account_id);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_scheduled_social_unique
  ON posts(scheduled_post_id, social_account_id)
  WHERE scheduled_post_id IS NOT NULL;

-- ============================================
-- Post Analytics (engagement metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  raw_data JSONB DEFAULT '{}', -- full API response
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_post_analytics_fetched_at ON post_analytics(fetched_at DESC);

-- ============================================
-- OAuth States (for CSRF protection)
-- ============================================
CREATE TABLE IF NOT EXISTS oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  state TEXT NOT NULL UNIQUE,
  code_verifier TEXT, -- for PKCE
  redirect_uri TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- ============================================
-- User Niche Config (personalized trend scoring)
-- ============================================
CREATE TABLE IF NOT EXISTS user_niche_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  primary_niche TEXT NOT NULL CHECK (
    primary_niche IN (
      'ai_ml',
      'web_dev',
      'devops',
      'cybersecurity',
      'startups',
      'product',
      'design',
      'data_science',
      'mobile',
      'blockchain'
    )
  ),
  secondary_niches TEXT[] DEFAULT '{}',
  expertise_description TEXT,
  audience_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_niche_config_user_id ON user_niche_config(user_id);

-- ============================================
-- Trend Sources (user-configured source settings)
-- ============================================
CREATE TABLE IF NOT EXISTS trend_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'company_blog',
      'github',
      'arxiv',
      'huggingface',
      'hackernews',
      'reddit',
      'producthunt',
      'x_search',
      'rss'
    )
  ),
  config JSONB NOT NULL DEFAULT '{}',
  polling_interval_minutes INTEGER NOT NULL DEFAULT 15 CHECK (polling_interval_minutes >= 5),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  last_sync_status TEXT DEFAULT 'idle' CHECK (last_sync_status IN ('idle', 'success', 'error')),
  last_sync_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trend_sources_user_id ON trend_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_trend_sources_type ON trend_sources(source_type);

-- ============================================
-- Trends (discovered trending topics)
-- ============================================
CREATE TABLE IF NOT EXISTS trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'company_blog',
      'github',
      'arxiv',
      'huggingface',
      'hackernews',
      'reddit',
      'producthunt',
      'x_search',
      'rss'
    )
  ),
  source_id TEXT NOT NULL,
  source_url TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  raw_data JSONB DEFAULT '{}',
  base_virality_score INTEGER NOT NULL DEFAULT 0 CHECK (base_virality_score BETWEEN 0 AND 100),
  niche_virality_score INTEGER NOT NULL DEFAULT 0 CHECK (niche_virality_score BETWEEN 0 AND 100),
  category TEXT CHECK (
    category IN (
      'ai_model',
      'software_launch',
      'framework_update',
      'research_paper',
      'industry_news',
      'tutorial',
      'discussion'
    )
  ),
  engagement_metrics JSONB DEFAULT '{}',
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'content_generated', 'published', 'dismissed')
  ),
  dedup_hash TEXT NOT NULL,
  source_references JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, dedup_hash)
);

CREATE INDEX IF NOT EXISTS idx_trends_user_status_score
  ON trends(user_id, status, niche_virality_score DESC);
CREATE INDEX IF NOT EXISTS idx_trends_discovered_at ON trends(discovered_at DESC);
CREATE INDEX IF NOT EXISTS idx_trends_category ON trends(category);

-- ============================================
-- Trend Content (AI-generated drafts per platform)
-- ============================================
CREATE TABLE IF NOT EXISTS trend_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'linkedin', 'threads', 'instagram')),
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'thread', 'carousel')),
  angle TEXT NOT NULL CHECK (
    angle IN (
      'breaking_news',
      'hot_take',
      'tutorial',
      'comparison',
      'industry_impact',
      'deep_dive',
      'personal_story',
      'contrarian'
    )
  ),
  content TEXT NOT NULL,
  thread_parts JSONB DEFAULT '[]',
  hashtags TEXT[] DEFAULT '{}',
  media_suggestions JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'approved', 'published', 'rejected')
  ),
  published_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trend_content_trend_id ON trend_content(trend_id);
CREATE INDEX IF NOT EXISTS idx_trend_content_user_platform ON trend_content(user_id, platform);

-- ============================================
-- Brand Voice Config (writing style personalization)
-- ============================================
CREATE TABLE IF NOT EXISTS brand_voice_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  voice_style TEXT NOT NULL DEFAULT 'educational' CHECK (
    voice_style IN ('technical', 'casual', 'thought_leader', 'educational', 'news_reporter')
  ),
  writing_samples TEXT[] DEFAULT '{}',
  tone_instructions TEXT,
  include_emojis BOOLEAN NOT NULL DEFAULT FALSE,
  include_source_attribution BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_angles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_voice_config_user_id ON brand_voice_config(user_id);

-- ============================================
-- Trend Publish Log (saturation tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS trend_publish_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  angle TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'linkedin', 'threads', 'instagram')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trend_publish_log_trend_angle
  ON trend_publish_log(trend_id, angle);
CREATE INDEX IF NOT EXISTS idx_trend_publish_log_user_id ON trend_publish_log(user_id);

-- ============================================
-- Topic Performance (topic/angle engagement analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS topic_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  trend_id UUID REFERENCES trends(id) ON DELETE SET NULL,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  angle TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'linkedin', 'threads', 'instagram')),
  impressions INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  profile_visits INTEGER NOT NULL DEFAULT 0,
  link_clicks INTEGER NOT NULL DEFAULT 0,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topic_performance_user_category ON topic_performance(user_id, category);
CREATE INDEX IF NOT EXISTS idx_topic_performance_user_angle ON topic_performance(user_id, angle);
CREATE INDEX IF NOT EXISTS idx_topic_performance_post_id ON topic_performance(post_id);

-- ============================================
-- Reel Templates + Jobs (Phase C scaffold)
-- ============================================
CREATE TABLE IF NOT EXISTS reel_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  style JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reel_templates_user_id ON reel_templates(user_id);

CREATE TABLE IF NOT EXISTS reel_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  trend_id UUID REFERENCES trends(id) ON DELETE SET NULL,
  template_id UUID REFERENCES reel_templates(id) ON DELETE SET NULL,
  script TEXT NOT NULL,
  voice_provider TEXT NOT NULL DEFAULT 'elevenlabs',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'rendering', 'completed', 'failed')),
  output_url TEXT,
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reel_jobs_user_id ON reel_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_reel_jobs_status ON reel_jobs(status);

-- ============================================
-- Functions
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
DO $$ 
BEGIN
    -- social_accounts
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_social_accounts_updated_at') THEN
        CREATE TRIGGER update_social_accounts_updated_at
            BEFORE UPDATE ON social_accounts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- drafts
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_drafts_updated_at') THEN
        CREATE TRIGGER update_drafts_updated_at
            BEFORE UPDATE ON drafts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- templates
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_templates_updated_at') THEN
        CREATE TRIGGER update_templates_updated_at
            BEFORE UPDATE ON templates
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- scheduled_posts
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_scheduled_posts_updated_at') THEN
        CREATE TRIGGER update_scheduled_posts_updated_at
            BEFORE UPDATE ON scheduled_posts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- user_niche_config
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_niche_config_updated_at') THEN
        CREATE TRIGGER update_user_niche_config_updated_at
            BEFORE UPDATE ON user_niche_config
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- trend_sources
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_trend_sources_updated_at') THEN
        CREATE TRIGGER update_trend_sources_updated_at
            BEFORE UPDATE ON trend_sources
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- trends
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_trends_updated_at') THEN
        CREATE TRIGGER update_trends_updated_at
            BEFORE UPDATE ON trends
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- trend_content
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_trend_content_updated_at') THEN
        CREATE TRIGGER update_trend_content_updated_at
            BEFORE UPDATE ON trend_content
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- brand_voice_config
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_brand_voice_config_updated_at') THEN
        CREATE TRIGGER update_brand_voice_config_updated_at
            BEFORE UPDATE ON brand_voice_config
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- reel_templates
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reel_templates_updated_at') THEN
        CREATE TRIGGER update_reel_templates_updated_at
            BEFORE UPDATE ON reel_templates
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- reel_jobs
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reel_jobs_updated_at') THEN
        CREATE TRIGGER update_reel_jobs_updated_at
            BEFORE UPDATE ON reel_jobs
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ============================================
-- Cleanup: Remove old tables if migrating
-- ============================================
-- DROP TABLE IF EXISTS todos; -- Remove example todos table
