const grid = document.getElementById('numberGrid');
const selected = [];
const reserved = new Set([14, 127, 255, 367, 482, 590, 641, 733, 828, 914]);
const sold = new Set([3, 122, 238, 399, 507, 667, 701, 845, 956]);

const TOTAL_CARTELAS = 10;
const NUMEROS_POR_CARTELA = 100;
let cartelaAtual = 0;

const cartelaTitulo = document.getElementById('cartelaTitulo');
const cartelaFaixa = document.getElementById('cartelaFaixa');
const prevCartela = document.getElementById('prevCartela');
const nextCartela = document.getElementById('nextCartela');
const cartelaDots = document.getElementById('cartelaDots');

function numeroFormatado(numero) {
  return String(numero).padStart(3, '0');
}

function renderCartela() {
  const inicio = cartelaAtual * NUMEROS_POR_CARTELA;
  const fim = inicio + NUMEROS_POR_CARTELA - 1;

  cartelaTitulo.textContent = `CARTELA ${String(cartelaAtual + 1).padStart(2, '0')}`;
  cartelaFaixa.textContent = `Números ${numeroFormatado(inicio)}–${numeroFormatado(fim)}`;
  grid.innerHTML = '';

  for (let numero = inicio; numero <= fim; numero++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = numeroFormatado(numero);
    b.dataset.numero = numero;

    if (sold.has(numero)) b.classList.add('sold');
    else if (reserved.has(numero)) b.classList.add('reserved');
    else if (selected.includes(numero)) b.classList.add('selected');

    b.setAttribute('aria-label', `Número ${numeroFormatado(numero)}`);
    b.addEventListener('click', () => alternarNumero(numero, b));
    grid.appendChild(b);
  }

  atualizarDots();
  atualizarNavegacao();
}

function alternarNumero(numero, botao) {
  if (sold.has(numero) || reserved.has(numero)) return;

  const posicao = selected.indexOf(numero);

  if (posicao >= 0) {
    selected.splice(posicao, 1);
    botao.classList.remove('selected');
  } else if (selected.length < 10) {
    selected.push(numero);
    botao.classList.add('selected');
  } else {
    alert('Você pode selecionar no máximo 10 números.');
    return;
  }

  update();
}

function irParaCartela(indice) {
  if (indice < 0) indice = TOTAL_CARTELAS - 1;
  if (indice >= TOTAL_CARTELAS) indice = 0;
  cartelaAtual = indice;
  renderCartela();
}

function atualizarNavegacao() {
  prevCartela.disabled = false;
  nextCartela.disabled = false;
}

function atualizarDots() {
  cartelaDots.innerHTML = '';

  for (let i = 0; i < TOTAL_CARTELAS; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `cartela-dot${i === cartelaAtual ? ' ativo' : ''}`;
    dot.setAttribute('aria-label', `Ir para cartela ${i + 1}`);
    dot.addEventListener('click', () => irParaCartela(i));
    cartelaDots.appendChild(dot);
  }
}

function update() {
  const ordenados = [...selected].sort((a, b) => a - b);
  document.getElementById('selectedNumbers').textContent = ordenados.length
    ? ordenados.map(numeroFormatado).join(', ')
    : 'nenhum';

  document.getElementById('total').textContent = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(ordenados.length * 10);
}

prevCartela.addEventListener('click', () => irParaCartela(cartelaAtual - 1));
nextCartela.addEventListener('click', () => irParaCartela(cartelaAtual + 1));

// Navegação por gesto de toque: deslize horizontalmente na área dos números.
let toqueInicialX = 0;
let toqueInicialY = 0;

grid.addEventListener('touchstart', (event) => {
  const toque = event.changedTouches[0];
  toqueInicialX = toque.clientX;
  toqueInicialY = toque.clientY;
}, { passive: true });

grid.addEventListener('touchend', (event) => {
  const toque = event.changedTouches[0];
  const deslocamentoX = toque.clientX - toqueInicialX;
  const deslocamentoY = toque.clientY - toqueInicialY;

  if (Math.abs(deslocamentoX) < 55 || Math.abs(deslocamentoX) < Math.abs(deslocamentoY) * 1.2) return;

  if (deslocamentoX < 0) irParaCartela(cartelaAtual + 1);
  else irParaCartela(cartelaAtual - 1);
}, { passive: true });

// Teclado no computador: setas esquerda/direita mudam a cartela.
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') irParaCartela(cartelaAtual + 1);
  if (event.key === 'ArrowLeft') irParaCartela(cartelaAtual - 1);
});

document.getElementById('continueBtn').addEventListener('click', () => {
  if (!selected.length) {
    alert('Selecione pelo menos um número.');
    return;
  }

  const numeros = [...selected].sort((a, b) => a - b).map(numeroFormatado);
  alert('Prévia visual: aqui entraremos com a etapa de pagamento na próxima fase. Números: ' + numeros.join(', '));
});

renderCartela();
update();
