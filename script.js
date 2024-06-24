/*
finalizar prioridade gasto input > gasto turno
adicionar acumulos por turno no espaço em branco
botões melhores (excluir, editar [mudar no formulario], adicionar clicando em qlqr lugar do td (hover pra indicar)) 
- botoes nanicos: https://codepen.io/pharaohleap/pen/PovPdvj 
descricao acao https://codepen.io/raubaca/pen/PZzpVe
log
adm side (planilha primeiro)
*/

// variaveis globais

const NOMES_DAS_FICHAS = ["personagens", "krom-acoes", "leia-acoes", "thabata-acoes", "ranni-acoes", "olivia-acoes", "theodore-acoes","ramhaurg-acoes"]

const CSV = {
  personagens: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=6130267&single=true&output=csv",
  krom: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=326541608&single=true&output=csv",
  leia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=469831672&single=true&output=csv",
  thabata: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1656209977&single=true&output=csv",
  ranni: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=113461093&single=true&output=csv",
  olivia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1930982771&single=true&output=csv",
  theodore: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1202343266&single=true&output=csv",
  ramhaurg: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=415776272&single=true&output=csv"
}

const RECURSOS = ["vitalidadeAtual", "vitalidadeMaxima", "vitalidadeMitigacao", "estaminaAtual", "estaminaMaxima", "estaminaMitigacao", "manaAtual", "manaMaxima", "manaMitigacao"]

const CELULAS = ['nome', 'recurso', 'custo', 'efeito']

// banco de dados

function salvarFormulario(nomeDoFormulario) {
  var dadosDoFormulario = new FormData(document.getElementById(nomeDoFormulario));

  var nomeDaFicha = pegarNomeDaFichaDoGoogleSheet(nomeDoFormulario, NOMES_DAS_FICHAS)

  if (nomeDaFicha) {
    dadosDoFormulario.append("ficha", nomeDaFicha);
    fetch('https://script.google.com/macros/s/AKfycbxmPiyBK3aaAPXAu6btIy9gSfqSCDWrUeDcwuc9hT7BV7gB4P9RFeqbXpWTZJcjxeRW/exec', {
      method: 'POST',
      body: dadosDoFormulario
    });
  } else {
    console.error("Nome da ficha não encontrado!");
  }
}

function pegarNomeDaFichaDoGoogleSheet(nomeDoFormulario) {
  if (nomeDoFormulario === 'acao') {
    const nomeDoPersonagem = document.getElementById("nome").value.toLowerCase();
    const personagens = ["krom", "leia", "thabata", "ranni", "olivia", "theodore", "ramhaurg"];
    const index = personagens.indexOf(nomeDoPersonagem);
    return index !== -1 ? NOMES_DAS_FICHAS[index + 1] : null;
  } else {
    return NOMES_DAS_FICHAS[0]; // "personagens"
  }
}

function carregarFormularios() {
  pegarDadosDoCSV('acao')
  pegarDadosDoCSV('ficha')
}

function pegarDadosDoCSV(nomeDoFormulario) {
  const nomeDoPersonagem = document.getElementById("nome").value.toLowerCase();
  const urlDoCSV = nomeDoFormulario === 'acao' ? CSV[nomeDoPersonagem] : CSV.personagens;

  if (urlDoCSV) {
    Papa.parse(urlDoCSV, {
      download: true,
      header: true,
      complete: function(results) {
        dadosDoCSV = results.data;
        if (nomeDoFormulario === 'acao') {
          adicionarDadosDasAcoesNaTabelaAcao(dadosDoCSV);
        }
        else {
          adicionarDadosDoPersonagemNosInputs(dadosDoCSV);
        }
      }
    });
  } else {
    console.error("CSV não encontrado para o personagem ou tipo de formulário:", nomeDoFormulario);
  }
}

// pegando dados do banco de dados e imprimindo no HTML

function adicionarDadosDasAcoesNaTabelaAcao(dadosDaAcao) {
  const tbody = document.getElementById("acoes").getElementsByTagName("tbody")[0];
  const cabecalho = tbody.rows[0];
  const criacaoDeAcao = tbody.rows[1];

  let acaoHTML = formatarHTMLDaAcao(dadosDaAcao)
  
  tbody.innerHTML = cabecalho.outerHTML + criacaoDeAcao.outerHTML + acaoHTML;
}

function formatarHTMLDaAcao(dadosDaAcao){
  let acaoHTML = ''
  dadosDaAcao.forEach(acao => {
    let tr = ''
    tr += "<tr><td><button type='button' class='adicionar' onclick='adicionarAcaoNaTabelaTurno(this);'>+</button></td>"

    CELULAS.forEach(celula => {
      tr += "<td>" + acao[celula] + "</td>";
    });

    tr += "</tr>"

    acaoHTML += tr
  });
  return acaoHTML;
}

function adicionarDadosDoPersonagemNosInputs(dadosDoCSV) {
  var dadosDoPersonagem = pegarDadosDoPersonagem(dadosDoCSV)

  for (let i = 0; i < RECURSOS.length; i++) {
    document.getElementById(RECURSOS[i]).value = Object.values(dadosDoPersonagem)[i + 1];
  }
}

function pegarDadosDoPersonagem(dadosDoCSV) {
  nomeDoPersonagem = document.getElementById("nome").value;
  dadosDoPersonagem = [];
  for (var i = 0; i < dadosDoCSV.length; i++) {
    if (dadosDoCSV[i].nome == nomeDoPersonagem) {
      dadosDoPersonagem = dadosDoCSV[i];
      return dadosDoPersonagem;
    }
  }
  console.error("Dados do personagem não encontrados!");
  return null;
}

function adicionarAcaoNaTabelaTurno(elemento) {
  const tbody = document.getElementById("turno").getElementsByTagName("tbody")[0];
  const td = elemento.parentNode;
  const tr = td.parentNode;

  // acaoFormatada = acao.innerHTML sem o botão adicionar
  acaoFormatada = tr.innerHTML.trim().slice(td.outerHTML.length, tr.innerHTML.length)
  novaAcaoHTML = `<td><button type="button" class="remover" onclick="removerAcaoDaTabelaTurno(this);">x</button></td>${acaoFormatada}`

  tbody.innerHTML += novaAcaoHTML
  
  mostrarCustosTotaisDoTurno();
}

function removerAcaoDaTabelaTurno(elemento) {
  elemento.closest("tr").remove();
  mostrarCustosTotaisDoTurno();
}

function mostrarCustosTotaisDoTurno(){
  const recursos = pegarCustosTotaisDoTurno();
  if(!recursos) return;
  for (const [recurso, gasto] of Object.entries(recursos)) {
      mostrarValorAtualizadoDoRecursoNoInput(recurso.toLowerCase(), gasto);
  }
}

/* 
1. valores do gasto e da mitigação são computados com prioridade, ignorando os valores do turno até que o gasto seja igual a zero (independente se for computado ou não). dá prioridade pro turno só no hover
 não dá pra ser mais de um (100>99>90) porque também tem acumulo, ent vai ser mt coisa
*/

function mostrarValorAtualizadoDoRecursoNoInput(recurso, valorGasto) {
  mostrarValorAtualizadoDoRecurso(recurso)
  valorAtualizadoDoRecurso = pegarValorAtualizadoDoRecurso(recurso, valorGasto);
  valorAtualDoRecurso = parseInt(document.getElementById(recurso + "Atual").value);
  if (valorAtualDoRecurso != valorAtualizadoDoRecurso) {    
    let formatacaoDoInput = `${valorAtualDoRecurso}>${valorAtualizadoDoRecurso}`;
    document.getElementById(recurso + "Atual").value = formatacaoDoInput
  } else {
    document.getElementById(recurso + "Atual").value = valorAtualDoRecurso;
  }
}

function mostrarValorAtualizadoDoRecurso(recurso){
  gastoDoInput = document.getElementById(recurso+'Gasto')
  if(!gastoDoInput || !gas) console.log('a')
}

function enterNoInputDoGasto(evento, recurso) {
  if (evento.keyCode === 13) {
    return aplicarGastosNosRecursosPeloInput(recurso, -1)
  }
}

function aplicarGastosNosRecursosPeloInput(recurso, operacao) {
  inputDoGasto = document.getElementById(recurso + "Gasto");
  aplicarGastosNosRecursos(recurso, operacao, inputDoGasto.value)
  inputDoGasto.value = 0;
}

/*
  mudo a miigacao, se nao tiver nada no input, ele calcula com os valores do recurso

  acúmulos só contam com turno, nao contam com gasto do input

  se valor do input != null && != 0
    valorDoGasto = input
  else if turnoTemAcoes
    valorDoGasto = somaDosRecursosDaTabelaAcoes
  else
    console.error("Não há gastos a serem computados!")

  porém, se 
*/

function aplicarGastosNosRecursos(recurso, operacao, valorDoGasto) {
  const copiaDoValorDoGasto = operacao == 1 ? parseInt(-valorDoGasto) : (valorDoGasto);
  const valorAtualizadoDoRecurso = pegarValorAtualizadoDoRecurso(recurso, copiaDoValorDoGasto);
  document.getElementById(recurso + "Atual").value = valorAtualizadoDoRecurso;
}


function pegarValorAtualizadoDoRecurso(recurso, valorGasto) {
  copiaDoValorGasto = parseInt(valorGasto)
  const valorAtualDoRecurso = parseInt(document.getElementById(recurso + "Atual").value);
  if (!copiaDoValorGasto) return valorAtualDoRecurso;
  const valorMaximoDoRecurso = parseInt(document.getElementById(recurso + "Maxima").value);
  const mitigacaoDoRecurso = (parseInt(document.getElementById(recurso + "Mitigacao").value) || 0);

  if (valorAtualDoRecurso > valorMaximoDoRecurso) {
    // vida bônus (acima do máximo) não aplica mitigação e não cura
    return valorAtualDoRecurso - Math.max(copiaDoValorGasto, 0)
  } else if (copiaDoValorGasto < 0) {
    // copiaDoValorGasto < 0 == cura, não aplica mitigação
    return Math.min(valorAtualDoRecurso - copiaDoValorGasto, valorMaximoDoRecurso);
  } else {
    // calculo normal
    const valorMitigado = Math.max(copiaDoValorGasto - mitigacaoDoRecurso, 0)
    return Math.max(valorAtualDoRecurso - valorMitigado, 0);
  }
}

function encerrarTurno() {
    const recursos = pegarCustosTotaisDoTurno();
    if(!recursos) return;
    for (const [recurso, gasto] of Object.entries(recursos)) {
        if (gasto === 0) continue;
        aplicarGastosNosRecursos(recurso.toLowerCase(), -1, parsegasto);
    }

  //reseta a tabela turno
  const tbody = document.getElementById("turno").getElementsByTagName("tbody")[0];
  const cabecalho = tbody.rows[0];
  tbody.innerHTML = cabecalho.innerHTML
}

function pegarCustosTotaisDoTurno() {
  tabelaTurno = document.getElementById("turno");
  const linhasDaTabela = tabelaTurno.querySelectorAll("tr");

  var temAcoesNoTurno = false;
  
  const nomes = [];
  const recursos = {
    Vitalidade: 0,
    Mana: 0,
    Estamina: 0
  };
  const efeitos = [];

    linhasDaTabela.forEach(linha => {
    const celulas = linha.querySelectorAll('td');
    if (celulas.length > 0) {
      temAcoesNoTurno = true;
      const nome = celulas[1].innerText;
      const recurso = celulas[2].innerText;
      const custo = parseInt(celulas[3].innerText);
      const efeito = celulas[4].innerText;

      nomes.push(nome);
      if (recursos.hasOwnProperty(recurso)) {
        recursos[recurso] += custo;
      }
      efeitos.push(efeito);
    }
  });

  const inputDaNeutra = document.getElementById("neutra")
  if(!temAcoesNoTurno){
    inputDaNeutra.value = '';
    console.error("Não há linhas na tabela!");
    return 
  } else{
    const nomesDaNeutra = nomes.join(', ');
    const custosDaNeutra = Object.entries(recursos)
      .filter(([_, custo]) => custo !== 0)
      .map(([recurso, custo]) => `-${custo} ${recurso}`)
      .join(', ');
    const efeitosDaNeutra = efeitos.join(', ');

    const neutra = `=${nomesDaNeutra}; ${custosDaNeutra}; ${efeitosDaNeutra}=`;
    inputDaNeutra.value = neutra;
    return recursos;
  }
}

function pegarAcumulo(tipo) {
  acumulo = ""
  switch (tipo) {
    case "cortante":
      acumulo = "+1 Sangramento";
      break;
    case "perfurante":
      acumulo = "+1 Sangramento";
      break;
    case "fogo":
      acumulo = "+1 Queimadura";
      break;
    case "gelo":
      acumulo = "+1 Congelado";
      break;
    case "luz":
      acumulo = "+1 Cego Pela Luz";
      break;
    case "sombra":
      acumulo = "+1 Mente Partida";
      break;
    case "necrotico":
      acumulo = "+1 Necrosado";
      break;
    case "nulo":
      acumulo = "+1 Possessão";
      break;
    case "raio":
      acumulo = "+1 Eletrificado";
      break;
  }
  document.getElementById("acaoAcumulo").value = acumulo
}

function pesquisarAcaoPeloNome() {
  input = document.getElementById("acaoNome");
  filtro = input.value.toUpperCase();
  table = document.getElementById("acoes");

  // Loop through all list items, and hide those who don't match the search query
  // for (var i = 1; i < table.rows.length; i++) {
  //   valor = parseInt(table.rows[i].cells[6].innerHTML)
  for (i = 2; i < table.rows.length; i++) {
    nome = table.rows[i].cells[1];
    if (nome.innerHTML.toUpperCase().indexOf(filtro) > -1) {
      table.rows[i].style.display = "";
    } else {
      table.rows[i].style.display = "none";
    }
  }
}
