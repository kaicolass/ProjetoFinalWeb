const API = 'http://localhost:8080';

// ── Token helpers ────────────────────────────────────────────────────────────

function salvarToken(token) {
  localStorage.setItem('jwt_token', token);
}

function obterToken() {
  return localStorage.getItem('jwt_token');
}

function removerToken() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('usuario_nome');
}

function headersAuth() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${obterToken()}`
  };
}

// ── View switching ───────────────────────────────────────────────────────────

function mostrar(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById(viewId).classList.remove('hidden');
}

// ── API calls ────────────────────────────────────────────────────────────────

async function apiCadastrar(nome, email, senha) {
  const res = await fetch(`${API}/api/auth/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Erro ao cadastrar');
  }
}

async function apiLogin(email, senha) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  if (!res.ok) throw new Error('E-mail ou senha incorretos');
  return res.json();
}

async function apiListarTarefas() {
  const res = await fetch(`${API}/api/tarefas`, { headers: headersAuth() });
  if (!res.ok) throw new Error('Erro ao carregar tarefas');
  return res.json();
}

async function apiCriarTarefa(titulo, descricao) {
  const res = await fetch(`${API}/api/tarefas`, {
    method: 'POST',
    headers: headersAuth(),
    body: JSON.stringify({ titulo, descricao })
  });
  if (!res.ok) throw new Error('Erro ao criar tarefa');
  return res.json();
}

async function apiAtualizarTarefa(id, titulo, descricao) {
  const res = await fetch(`${API}/api/tarefas/${id}`, {
    method: 'PUT',
    headers: headersAuth(),
    body: JSON.stringify({ titulo, descricao })
  });
  if (!res.ok) throw new Error('Erro ao atualizar tarefa');
  return res.json();
}

async function apiAlternarStatus(id) {
  const res = await fetch(`${API}/api/tarefas/${id}/status`, {
    method: 'PATCH',
    headers: headersAuth()
  });
  if (!res.ok) throw new Error('Erro ao atualizar status');
  return res.json();
}

async function apiDeletarTarefa(id) {
  const res = await fetch(`${API}/api/tarefas/${id}`, {
    method: 'DELETE',
    headers: headersAuth()
  });
  if (!res.ok) throw new Error('Erro ao deletar tarefa');
}

// ── Render tasks ─────────────────────────────────────────────────────────────

function renderizarTarefas(tarefas) {
  const lista = document.getElementById('lista-tarefas');
  const vazia = document.getElementById('lista-vazia');
  const resumo = document.getElementById('resumo-tarefas');

  lista.innerHTML = '';

  const concluidas = tarefas.filter(t => t.statusConcluida).length;
  resumo.textContent = tarefas.length
    ? `${concluidas} de ${tarefas.length} concluída${tarefas.length !== 1 ? 's' : ''}`
    : '';

  if (tarefas.length === 0) {
    vazia.classList.remove('hidden');
    return;
  }
  vazia.classList.add('hidden');

  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.className = `tarefa-item${tarefa.statusConcluida ? ' concluida' : ''}`;
    li.dataset.id = tarefa.id;
    li.innerHTML = `
      <input type="checkbox" class="tarefa-check" ${tarefa.statusConcluida ? 'checked' : ''} title="Marcar como ${tarefa.statusConcluida ? 'pendente' : 'concluída'}" />
      <div class="tarefa-body">
        <div class="tarefa-titulo">${escapar(tarefa.titulo)}</div>
        ${tarefa.descricao ? `<div class="tarefa-descricao">${escapar(tarefa.descricao)}</div>` : ''}
      </div>
      <div class="tarefa-acoes">
        <button class="btn-icon btn-edit" title="Editar">✏️</button>
        <button class="btn-icon btn-delete" title="Excluir">🗑️</button>
      </div>
    `;

    li.querySelector('.tarefa-check').addEventListener('change', () => toggleStatus(tarefa.id, li));
    li.querySelector('.btn-delete').addEventListener('click', () => deletar(tarefa.id, li));
    li.querySelector('.btn-edit').addEventListener('click', () => iniciarEdicao(tarefa, li));

    lista.appendChild(li);
  });
}

function escapar(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ── Task actions ─────────────────────────────────────────────────────────────

async function toggleStatus(id, li) {
  try {
    const atualizada = await apiAlternarStatus(id);
    li.className = `tarefa-item${atualizada.statusConcluida ? ' concluida' : ''}`;
    li.querySelector('.tarefa-check').checked = atualizada.statusConcluida;
    li.querySelector('.tarefa-check').title = `Marcar como ${atualizada.statusConcluida ? 'pendente' : 'concluída'}`;
    atualizarResumo();
  } catch (e) {
    mostrarErroTarefas(e.message);
  }
}

async function deletar(id, li) {
  try {
    await apiDeletarTarefa(id);
    li.remove();
    atualizarResumo();
    if (document.querySelectorAll('.tarefa-item').length === 0) {
      document.getElementById('lista-vazia').classList.remove('hidden');
    }
  } catch (e) {
    mostrarErroTarefas(e.message);
  }
}

function iniciarEdicao(tarefa, li) {
  const corpo = li.querySelector('.tarefa-body');
  const acoes = li.querySelector('.tarefa-acoes');
  acoes.classList.add('hidden');

  corpo.innerHTML = `
    <div class="edit-form">
      <input type="text" class="edit-titulo" value="${escapar(tarefa.titulo)}" required />
      <input type="text" class="edit-descricao" value="${escapar(tarefa.descricao || '')}" placeholder="Descrição (opcional)" />
      <div class="edit-btns">
        <button class="btn btn-save">Salvar</button>
        <button class="btn btn-cancel-edit">Cancelar</button>
      </div>
    </div>
  `;

  corpo.querySelector('.btn-cancel-edit').addEventListener('click', () => carregarTarefas());

  corpo.querySelector('.btn-save').addEventListener('click', async () => {
    const novoTitulo = corpo.querySelector('.edit-titulo').value.trim();
    const novaDescricao = corpo.querySelector('.edit-descricao').value.trim();
    if (!novoTitulo) return;
    try {
      await apiAtualizarTarefa(tarefa.id, novoTitulo, novaDescricao);
      await carregarTarefas();
    } catch (e) {
      mostrarErroTarefas(e.message);
    }
  });
}

function atualizarResumo() {
  const itens = document.querySelectorAll('.tarefa-item');
  const concluidas = document.querySelectorAll('.tarefa-item.concluida').length;
  const resumo = document.getElementById('resumo-tarefas');
  resumo.textContent = itens.length
    ? `${concluidas} de ${itens.length} concluída${itens.length !== 1 ? 's' : ''}`
    : '';
}

// ── Load tasks ───────────────────────────────────────────────────────────────

async function carregarTarefas() {
  const loading = document.getElementById('loading');
  loading.classList.remove('hidden');
  document.getElementById('tarefas-error').classList.add('hidden');
  try {
    const tarefas = await apiListarTarefas();
    renderizarTarefas(tarefas);
  } catch (e) {
    mostrarErroTarefas(e.message);
  } finally {
    loading.classList.add('hidden');
  }
}

function mostrarErroTarefas(msg) {
  const el = document.getElementById('tarefas-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

// ── Event listeners ──────────────────────────────────────────────────────────

document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  const btn = document.getElementById('btn-login');
  const erro = document.getElementById('login-error');

  erro.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try {
    const { token } = await apiLogin(email, senha);
    salvarToken(token);
    localStorage.setItem('usuario_nome', email.split('@')[0]);
    document.getElementById('usuario-nome').textContent = email.split('@')[0];
    mostrar('view-tarefas');
    carregarTarefas();
  } catch (err) {
    erro.textContent = err.message;
    erro.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
});

document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('cadastro-nome').value;
  const email = document.getElementById('cadastro-email').value;
  const senha = document.getElementById('cadastro-senha').value;
  const btn = document.getElementById('btn-cadastro');
  const erro = document.getElementById('cadastro-error');
  const sucesso = document.getElementById('cadastro-success');

  erro.classList.add('hidden');
  sucesso.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'Criando conta...';

  try {
    await apiCadastrar(nome, email, senha);
    sucesso.textContent = 'Conta criada! Redirecionando para o login...';
    sucesso.classList.remove('hidden');
    setTimeout(() => mostrar('view-login'), 1800);
    e.target.reset();
  } catch (err) {
    erro.textContent = err.message.includes('409') || err.message.includes('CONFLICT')
      ? 'Este e-mail já está cadastrado.'
      : err.message;
    erro.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar conta';
  }
});

document.getElementById('form-nova-tarefa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('nova-titulo').value.trim();
  const descricao = document.getElementById('nova-descricao').value.trim();
  const btn = document.getElementById('btn-adicionar');

  btn.disabled = true;
  btn.textContent = 'Adicionando...';

  try {
    await apiCriarTarefa(titulo, descricao);
    e.target.reset();
    await carregarTarefas();
  } catch (err) {
    mostrarErroTarefas(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Adicionar';
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  removerToken();
  mostrar('view-login');
  document.getElementById('form-login').reset();
});

document.getElementById('ir-cadastro').addEventListener('click', (e) => {
  e.preventDefault();
  mostrar('view-cadastro');
});

document.getElementById('ir-login').addEventListener('click', (e) => {
  e.preventDefault();
  mostrar('view-login');
});

// ── Init ─────────────────────────────────────────────────────────────────────

(function init() {
  const token = obterToken();
  if (token) {
    const nome = localStorage.getItem('usuario_nome') || '';
    document.getElementById('usuario-nome').textContent = nome;
    mostrar('view-tarefas');
    carregarTarefas();
  } else {
    mostrar('view-login');
  }
})();
