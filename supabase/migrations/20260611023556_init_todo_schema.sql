-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    nome         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    senha_hash   VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo           VARCHAR(200) NOT NULL,
    descricao        TEXT,
    status_concluida BOOLEAN      NOT NULL DEFAULT FALSE,
    data_criacao     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_id       UUID         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índice para acelerar buscas por usuário
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario_id ON tarefas(usuario_id);
