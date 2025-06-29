const WebSocket = require('ws');

//criando servidor ws
const wss = new WebSocket.Server({ port: 3001 });

// inicial state de prestadores por serviço
let prestadores = [
  { id: 1, nome: "Maria", votos: 0, servico: "Reparo" },
  { id: 2, nome: "João", votos: 0, servico: "Limpeza" },
  { id: 3, nome: "Marcelo", votos: 0, servico: "Professor" },
  { id: 4, nome: "Del Mestre", votos: 0, servico: "Professor" },
  { id: 5, nome: "Fuji", votos: 0, servico: "Professor" },
  { id: 6, nome: "Roberto", votos: 0, servico: "Professor" },
  { id: 7, nome: "Paulo", votos: 0, servico: "Reparo" },
  { id: 8, nome: "Ana Clara", votos: 0, servico: "Limpeza" },
  { id: 9, nome: "Júlia", votos: 0, servico: "Limpeza" },
  { id: 10, nome: "Robertão", votos: 0, servico: "Reparo" }
];


// envia dados para todos os clientes conectados
function transmissao(dado) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(dado));
    }
  });
}

//serviço global
let historicoVotacoes = [];
let servicoAtivo = null;
let nomeVotacaoAtiva = null;

// quando um cliente se conecta
wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  // Escuta mensagens do cliente
  ws.on("message", (mensagem) => {
    const msg = JSON.parse(mensagem);

    switch (msg.tipo) {
      case "iniciar_votacao":
        servicoAtivo = msg.servico;
        nomeVotacaoAtiva = msg.nomeVotacao || "Votação sem nome";
        
        prestadores = prestadores.map((p) =>
          p.servico === servicoAtivo ? { ...p, votos: 0 } : p
        );
        
        const prestadoresFiltrados = prestadores.filter(p => p.servico === servicoAtivo);
        transmissao({ tipo: "prestadores_para_votar", dados: prestadoresFiltrados, nomeVotacao: nomeVotacaoAtiva });
        break;

      case "votar":       
        const prestadoresFiltradosVoto = prestadores.filter(p => p.servico === servicoAtivo);
        const p = prestadoresFiltradosVoto.find(p => p.id === msg.prestadorId);
        if (p) {
          p.votos++;
          transmissao({
            tipo: "atualizar_ranking",
            dados: prestadoresFiltradosVoto,
            nomeVotacao: nomeVotacaoAtiva 
          });
        }
        break;

      case "encerrar_votacao":
        const prestadoresFiltradosEncerrada = prestadores.filter(p => p.servico === servicoAtivo);

        const rankingFinal = prestadoresFiltradosEncerrada
          .filter(p => p.servico === servicoAtivo)
          .sort((a, b) => b.votos - a.votos);

        historicoVotacoes.push({
          nomeVotacao: nomeVotacaoAtiva,
          data: new Date().toISOString(),
          ranking: rankingFinal
        });
        
        transmissao({
          tipo: "votacao_encerrada",
          dados: rankingFinal,
          nomeVotacao: nomeVotacaoAtiva
        });
          servicoAtivo = null;
          nomeVotacaoAtiva = null;
        break;

      case "resetar_votacao":
        prestadores = prestadores.map(p =>p.servico === servicoAtivo ? { ...p, votos: 0 } : p);
        const prestadoresZerados = prestadores.filter(p => p.servico === servicoAtivo);
        transmissao({ tipo: "prestadores_para_votar", dados: prestadoresZerados });
        break;

      case "pedir_historico":
        ws.send(JSON.stringify({
          tipo: "historico_votacoes",
          dados: historicoVotacoes
        }));
        break;

    }
  });
});
