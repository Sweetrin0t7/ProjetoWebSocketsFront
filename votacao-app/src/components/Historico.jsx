import React, { useEffect, useState } from "react";
import socket from "../services/socket";

export default function Historico() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    function handleMessage(event) {
      const msg = JSON.parse(event.data);

      if (msg.tipo === "historico_votacoes") {
        setHistorico(msg.dados);
      }
    }

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="container">
      <h2>Histórico de Votações</h2>
      {historico.length === 0 ? (
        <p>Nenhuma votação encerrada ainda.</p>
      ) : (
        historico.map((votacao, idx) => (
          <div key={idx} className="historico-item">
            <h3>{votacao.nomeVotacao}</h3>
            <small>{new Date(votacao.data).toLocaleString()}</small>
            <ol>
              {votacao.ranking.map((p) => (
                <li key={p.id}>
                  {p.nome} - {p.votos} voto{p.votos !== 1 ? "s" : ""}
                </li>
              ))}
            </ol>
          </div>
        ))
      )}
    </div>
  );
}
