// ==========================================================
// 1. SELEÇÃO DOS ELEMENTOS HTML
// Guardamos referências aos elementos do DOM que serão usados
// repetidamente, evitando buscar no DOM toda vez (melhor performance)
// ==========================================================
const inputTexto = document.querySelector('#input-texto');       // campo de texto do lembrete
const selectPrioridade = document.querySelector('#select-prioridade'); // select de prioridade
const btnAdicionar = document.querySelector('#btn-adicionar');   // botão "Adicionar"
const listaLembretes = document.querySelector('#lista-lembretes'); // container onde os cards entram
const msgErro = document.querySelector('#msg-erro');             // elemento para exibir erros

// Valor padrão da prioridade, usado para resetar o select depois de adicionar
const PRIORIDADE_PADRAO = 'baixa';

// ==========================================================
// 2. FUNÇÃO PRINCIPAL: adiciona um novo lembrete à lista
// ==========================================================
function adicionarLembrete() {
  // Pega o texto digitado e remove espaços em branco no início/fim
  const texto = inputTexto.value.trim();
  // Pega a prioridade selecionada no <select>
  const prioridade = selectPrioridade.value;

  // --- Validação ---
  // Se o campo estiver vazio, mostra erro e interrompe a função (return)
  if (texto === '') {
    msgErro.textContent = 'Por favor, digite a descrição do lembrete!';
    inputTexto.focus(); // devolve o foco pro campo, ajudando o usuário a corrigir
    return; // encerra a função aqui, não cria o card
  }

  // Se passou na validação, garante que a mensagem de erro anterior suma
  msgErro.textContent = '';

  // --- Criação do card ---
  // Delega a criação do elemento HTML para uma função separada 
  const novoCard = criarCardLembrete(texto, prioridade);
  // Insere o card criado dentro do container da lista
  listaLembretes.appendChild(novoCard);
  // --- Reset do formulário ---
  // Limpa o campo de texto para o usuário poder digitar o próximo lembrete
  inputTexto.value = '';
  // Volta o select para a prioridade padrão
  selectPrioridade.value = PRIORIDADE_PADRAO;
  // Devolve o foco ao input, agilizando a digitação de vários lembretes seguidos
  inputTexto.focus();
}


// ==========================================================
// 3. CRIAÇÃO DO CARD (de forma segura, sem innerHTML)
// Construir os elementos "na mão" evita XSS: se usássemos innerHTML
// com o texto do usuário, alguém poderia digitar código HTML/JS malicioso
// ==========================================================
function criarCardLembrete(texto, prioridade) {
  // Cria o elemento principal do card (div)
  const card = document.createElement('div');
  // Adiciona a classe base do card + a classe da prioridade (ex: "card-item alta")
  // Isso permite estilizar cada prioridade com uma cor diferente via CSS
  card.classList.add('card-item', prioridade);

  // Div que agrupa o texto e a prioridade (conteúdo textual do card)
  const infoWrapper = document.createElement('div');

  // Parágrafo que vai conter o texto em negrito
  const paragrafo = document.createElement('p');
  const strong = document.createElement('strong');
  // textContent (em vez de innerHTML) insere o texto como TEXTO PURO,
  // não como HTML — por isso é seguro contra injeção de scripts
  strong.textContent = texto;
  paragrafo.appendChild(strong);

  // Elemento pequeno mostrando a prioridade em maiúsculas
  const pequeno = document.createElement('small');
  pequeno.textContent = `Prioridade: ${prioridade.toUpperCase()}`;

  // Junta o parágrafo e o "small" dentro do wrapper de informações
  infoWrapper.append(paragrafo, pequeno);

  // --- Botão de excluir ---
  const btnDeletar = document.createElement('button');
  btnDeletar.type = 'button'; // evita que o botão tente submeter algum form
  btnDeletar.classList.add('btn-deletar');
  btnDeletar.textContent = 'Excluir';
  // aria-label ajuda leitores de tela a saberem QUAL lembrete será excluído,
  // já que existem vários botões "Excluir" iguais na página
  btnDeletar.setAttribute('aria-label', `Excluir lembrete: ${texto}`);
  // Ao clicar, remove o card inteiro do DOM
  btnDeletar.addEventListener('click', () => card.remove());

  // Monta o card final: informações + botão de excluir
  card.append(infoWrapper, btnDeletar);

  // Retorna o card pronto para ser inserido na lista
  return card;
}

// ==========================================================
// 4. EVENTOS DA PÁGINA
// ==========================================================

// Clique no botão "Adicionar" dispara a função principal
btnAdicionar.addEventListener('click', adicionarLembrete);

// Permite adicionar o lembrete pressionando "Enter" dentro do input
inputTexto.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    // Evita comportamento padrão do Enter (ex: submit de formulário)
    evento.preventDefault();
    adicionarLembrete();
  }
});

// Assim que o usuário começa a digitar de novo, some com a mensagem de erro
// (melhora a experiência: o erro não fica "preso" na tela sem necessidade)
inputTexto.addEventListener('input', () => {
  if (msgErro.textContent) msgErro.textContent = '';
});
