function salvarFormulario(formulario) {
  var dadosDoFormulario = new FormData(document.getElementById(formulario));

  //document.getElementById("acoes").innerHTML += placeholderName(formData.entries()); NAO COLOCAR, PQ NAO TIRA O ANTIGO
  var nomeDaFicha = pegarNomeDaFicha(formulario)

  dadosDoFormulario.append("ficha", nomeDaFicha)
  fetch('https://script.google.com/macros/s/AKfycbxmPiyBK3aaAPXAu6btIy9gSfqSCDWrUeDcwuc9hT7BV7gB4P9RFeqbXpWTZJcjxeRW/exec',
    {
      method: 'post',
      body: dadosDoFormulario
    })
}

function pegarNomeDaFicha(nomeDoFormulario) {
  if (nomeDoFormulario == 'acao') {
    nomeDoPersonagem = document.getElementById("nome").value;
    switch (nomeDoPersonagem) {
      case "krom":
        return "krom-acoes";
      case "leia":
        return "leia-acoes";
      case "thabata":
        return "thabata-acoes";
      case "ranni":
        return "ranni-acoes";
      case "olivia":
        return "olivia-acoes";
      case "theodore":
        return "theodore-acoes";
      case "ramhaurg":
        return "ramhaurg-acoes";
    }
  } else {
    return "fichas-demo";
  }
}

function pegarDataDoCSV(form) {

  var csv = pegarCSV(form)

  Papa.parse(csv, {
    download: true,
    header: true,
    complete: function(results) {
      dadosDoCSV = results.data;
      if (form == 'acao') {
        adicionarDadosDasAcoesNaTabela(dadosDoCSV);
      }
      else {
        formatarDadosDoPersonagem(dadosDoCSV);
      }
    }
  });
}

function pegarCSV(nomeDoFormulario) {
  const acoesCSV = {
    krom: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=326541608&single=true&output=csv",
    leia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=469831672&single=true&output=csv",
    thabata: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1656209977&single=true&output=csv",
    ranni: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=113461093&single=true&output=csv",
    olivia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1930982771&single=true&output=csv",
    theodore: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1202343266&single=true&output=csv",
    ramhaurg: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=415776272&single=true&output=csv"
  }

  const fichasCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=6130267&single=true&output=csv"

  if (nomeDoFormulario == 'acao') {
    nomeDoPersonagem = document.getElementById("nome").value;
    switch (nomeDoPersonagem) {
      case "krom":
        return acoesCSV.krom;
      case "leia":
        return acoesCSV.leia;
      case "thabata":
        return acoesCSV.thabata;
      case "ranni":
        return acoesCSV.ranni;
      case "olivia":
        return acoesCSV.olivia;
      case "theodore":
        return acoesCSV.theodore;
      case "ramhaurg":
        return acoesCSV.ramhaurg;
    }
  } else {
    return fichasCSV;
  }
}

function adicionarDadosDasAcoesNaTabela(dadosDaAcao) {
  tbody = document.getElementById("acoes").childNodes[1]
  var acao = []
  for (i = 0; i < dadosDaAcao.length; i++) {
    acao += formatarDadosDaAcao(Object.entries(dadosDaAcao[i]));
  }

  header = tbody.rows[0];
  form = tbody.rows[1];
  tbody.innerHTML = header.outerHTML + form.outerHTML + acao;
}

function formatarDadosDaAcao(acaoObjeto) {
  var acaoHTML = ['<tr><td><button type="button" class="adicionar" onclick="adicionarAcao(this);">+</button></td>']
  for (var entrada of acaoObjeto) {
    var valorDaEntrada = entrada[1]
    acaoHTML += '<td>' + valorDaEntrada + '</td>';
  }
  acaoHTML += '</tr>'
  return acaoHTML;
}

function formatarDadosDoPersonagem(dadosDoCSV) {
  nomeDoPersonagem = document.getElementById("nome").value;
  dadosDoPersonagem = [];
  for (var i = 0; i < dadosDoCSV.length; i++) {
    if (dadosDoCSV[i].nome == nomeDoPersonagem) {
      dadosDoPersonagem = dadosDoCSV[i];
    }
  }
  adicionarDadosDoPersonagemNosInputs(dadosDoPersonagem);
}

function adicionarDadosDoPersonagemNosInputs(dadosDoPersonagem) {
  var recursos = ["vitalidadeAtual", "vitalidadeMaxima", "vitalidadeMitigacao", "estaminaAtual", "estaminaMaxima", "estaminaMitigacao", "manaAtual", "manaMaxima", "manaMitigacao"]

  for (let i = 0; i < recursos.length; i++) {
    document.getElementById(recursos[i]).value = Object.values(dadosDoPersonagem)[i + 1];
  }
}


/*
function salvarFormulario(formulario) {
  var dadosDoFormulario = new FormData(document.getElementById(formulario));

  //document.getElementById("acoes").innerHTML += placeholderName(formData.entries()); NAO COLOCAR, PQ NAO TIRA O ANTIGO
  var nomeDaFicha = pegarNomeDaFicha(formulario)

  dadosDoFormulario.append("ficha", nomeDaFicha)
  fetch('https://script.google.com/macros/s/AKfycbxmPiyBK3aaAPXAu6btIy9gSfqSCDWrUeDcwuc9hT7BV7gB4P9RFeqbXpWTZJcjxeRW/exec',
    {
      method: 'post',
      body: dadosDoFormulario
    })
}

function pegarNomeDaFicha(nomeDoFormulario) {
  if (nomeDoFormulario == 'acao') {
    nome = document.getElementById("nome").value;
    switch (nome) {
      case "krom":
        return "krom-acoes";
      case "leia":
        return "leia-acoes";
      case "thabata":
        return "thabata-acoes";
      case "ranni":
        return "ranni-acoes";
      case "olivia":
        return "olivia-acoes";
      case "theodore":
        return "theodore-acoes";
      case "ramhaurg":
        return "ramhaurg-acoes";
    }
  } else {
    return "fichas-demo";
  }
}

function pegarDataDoCSV(form) {

  var csv = pegarCSV(form)

  Papa.parse(csv, {
    download: true,
    header: true,
    complete: function(results) {
      csvData = results.data;

      if (form == 'acao') {
        adicionarAcoesNaTabela(csvData);
      }
      else {
        carregarFichaPersonagem(csvData);
      }
    }
  });
}

function pegarCSV(nomeDoFormulario) {
  const acoesCSV = {
    krom: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=326541608&single=true&output=csv",
    leia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=469831672&single=true&output=csv",
    thabata: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1656209977&single=true&output=csv",
    ranni: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1656209977&single=true&output=csv",
    olivia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1930982771&single=true&output=csv",
    theodore: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1202343266&single=true&output=csv",
    ramhaurg: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=1930982771&single=true&output=csv"
  }

  const fichasCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCRgYCLtQjgkv8mFOhdMP-BgvUCQGkyiTH5eQQcRXDDTIrLeD5pWScdVZqxezO_rnx7xfqZVJ8RrBt/pub?gid=0&single=true&output=csv"

  if (nomeDoFormulario == 'acao') {
    nome = document.getElementById("nome").value;
    switch (nome) {
      case "krom":
        return acoesCSV.krom;
      case "leia":
        return acoesCSV.leia;
      case "thabata":
        return acoesCSV.thabata;
      case "ranni":
        return acoesCSV.ranni;
      case "olivia":
        return acoesCSV.olivia;
      case "theodore":
        return acoesCSV.theodore;
      case "ramhaurg":
        return acoesCSV.ramhaurg;
    }
  } else {
    return fichasCSV;
  }
}

function adicionarAcoesNaTabela(dadosDaAcao) {
  tbody = document.getElementById("acoes").childNodes[1]
  var acao = []
  for (i = 0; i < dadosDaAcao.length; i++) {
    acao += formatarAcaoHTML(Object.entries(dadosDaAcao[i]));
  }

  cabecalho = tbody.rows[0];
  criacaoDeAcao = tbody.rows[1];
  tbody.innerHTML = cabecalho.outerHTML + criacaoDeAcao.outerHTML + acao;
}

function formatarAcaoHTML(object) {
  var acaoHTML = ['<tr><td><button type="button" class="adicionar" onclick="adicionarAcao(this);">+</button></td>']
  for (var pair of object) {
    pair[1] = valorDoDado
    acaoHTML += '<td>' + valorDoDado + '</td>';
  }
  acaoHTML += '</tr>'
  return acaoHTML;
}

function carregarFichaPersonagem(dadosDoPersonagem) {
  nomeDoPersonagem = document.getElementById("nome").value;
  fichaDoPersonagem = [];
  for (var i = 0; i < dadosDoPersonagem.length; i++) {
    if (dadosDoPersonagem[i].nome == nomeDoPersonagem) {
      fichaDoPersonagem = dadosDoPersonagem[i];
    }
  }
  return fichaDoPersonagem;
}

function adicionarFichaPersonagemNosInputs(dadosDoPersonagem) {
  var recursos = ["vitalidadeAtual", "vitalidadeMaxima", "vitalidadeMitigacao", "estaminaAtual", "estaminaMaxima", "estaminaMitigacao", "manaAtual", "manaMaxima", "manaMitigacao"]

  fichaDoPersonagem = carregarFichaPersonagem(dadosDoPersonagem)

  for (let i = 0; i < recursos.length; i++) {
    document.getElementById(recursos[i]).value = Object.values(fichaDoPersonagem)[i + 1];
  }
}

*/