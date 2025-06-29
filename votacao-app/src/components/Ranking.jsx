import React, { useState, useEffect } from "react";
import socket from "../services/socket"; 
export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [nomeVotacao, setNomeVotacao] = useState("");

  useEffect(() => {
    function handleMessage(event) {
      const msg = JSON.parse(event.data);

      if (msg.tipo === "atualizar_ranking" || msg.tipo === "votacao_encerrada" || msg.tipo === "prestadores_para_votar") {
        setRanking(msg.dados);
        if (msg.nomeVotacao) setNomeVotacao(msg.nomeVotacao);
      }
    }

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="container">
      <h2>Ranking {nomeVotacao && `- ${nomeVotacao}`}</h2>
      {ranking.length === 0 ? (
        <p>Nenhum voto registrado ainda.</p>
      ) : (
        ranking.map((p, i) => (
          <div key={p.id} className="ranking-item">
            {i + 1}º - {p.nome} ({p.votos} voto{p.votos !== 1 ? "s" : ""})
          </div>
        ))
      )}
    </div>
  );
}

