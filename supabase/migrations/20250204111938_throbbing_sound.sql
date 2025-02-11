-- Create AI agents table
CREATE TABLE ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  name text,
  welcome_message text,
  response_style text,
  status text NOT NULL DEFAULT 'training',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_trained_at timestamptz,
  total_conversations integer DEFAULT 0,
  average_response_time numeric(10,2) DEFAULT 0,
  satisfaction_rate integer DEFAULT 0,
  CONSTRAINT status_check CHECK (status IN ('training', 'active', 'inactive'))
);

-- Create AI conversations table
CREATE TABLE ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add AI support flag to users table
ALTER TABLE users ADD COLUMN has_ai_support boolean DEFAULT false;

-- Enable RLS
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- AI agents policies
CREATE POLICY "Users can view their own AI agents"
  ON ai_agents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI agents"
  ON ai_agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI agents"
  ON ai_agents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- AI conversations policies
CREATE POLICY "Users can view conversations for their agents"
  ON ai_conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create conversations"
  ON ai_conversations
  FOR INSERT
  WITH CHECK (true);

-- Function to update agent stats
CREATE OR REPLACE FUNCTION update_agent_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_agents
  SET 
    total_conversations = (
      SELECT COUNT(*) 
      FROM ai_conversations 
      WHERE agent_id = NEW.agent_id
    ),
    average_response_time = (
      SELECT AVG(EXTRACT(EPOCH FROM (created_at - lag(created_at) OVER (ORDER BY created_at))))
      FROM ai_conversations
      WHERE agent_id = NEW.agent_id
    ),
    satisfaction_rate = (
      SELECT ROUND(AVG(rating) * 20)
      FROM ai_conversations
      WHERE agent_id = NEW.agent_id
      AND rating IS NOT NULL
    )
  WHERE id = NEW.agent_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating agent stats
CREATE TRIGGER update_agent_stats_trigger
  AFTER INSERT OR UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_stats();