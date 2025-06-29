import React, { useEffect, useState } from "react";
import socket from "../services/socket";

export default function Votacao() {
  const [prestadores, setPrestadores] = useState([]);
  const [totalVotos, setTotalVotos] = useState(0);
  const [votacaoEncerrada, setVotacaoEncerrada] = useState(false);
  const [nomeVotacao, setNomeVotacao] = useState("");

    useEffect(() => {
    function handleMessage(event) {
        const msg = JSON.parse(event.data);

        if (msg.tipo === "prestadores_para_votar" || msg.tipo === "atualizar_ranking") {
        setPrestadores(msg.dados);
        setVotacaoEncerrada(false);
        setNomeVotacao(msg.nomeVotacao || "");
        const total = msg.dados.reduce((acc, p) => acc + p.votos, 0);
        setTotalVotos(total);
        }

        if (msg.tipo === "votacao_encerrada") {
        setPrestadores(msg.dados);
        setVotacaoEncerrada(true);
        setNomeVotacao(msg.nomeVotacao || "");
        const total = msg.dados.reduce((acc, p) => acc + p.votos, 0);
        setTotalVotos(total);
        }
    }

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
    }, []);

  const votar = (id) => {
    socket.send(JSON.stringify({ tipo: "votar", prestadorId: id }));
  };

return (
  <div className="container">
    <h2>Vote no seu prestador favorito na Votação {nomeVotacao}</h2>

    {!votacaoEncerrada ? (
      prestadores.length === 0 ? (
        <p>Aguardando o início da votação...</p>
      ) : (
        prestadores.map((p) => {
          const porcentagem = totalVotos > 0 ? (p.votos / totalVotos) * 100 : 0;

          return (
            <div key={p.id} className="votacao-item">
              <strong>{p.nome}</strong> – {p.votos} voto{p.votos !== 1 ? "s" : ""}
              <div
                className="voto-bar"
                style={{ width: `${porcentagem}%`, maxWidth: "100%" }}
              />
              <button onClick={() => votar(p.id)}>Votar</button>
            </div>
          );
        })
      )
    ) : (
      <div>
        {prestadores.map((p) => (
          <div key={p.id} className="votacao-item">
            <strong>{p.nome}</strong> – {p.votos} voto{p.votos !== 1 ? "s" : ""}
          </div>
        ))}
        <p style={{ marginTop: "20px", fontStyle: "italic" }}>✅ Votação encerrada.</p>
      </div>
    )}
  </div>
);

}
