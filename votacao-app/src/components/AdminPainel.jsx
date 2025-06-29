import React, { useState, useEffect } from "react";
import socket from "../services/socket"; 

export default function AdminPainel(){
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const servicosDisponiveis = ["Reparo", "Limpeza", "Professor"];
    const [nomeVotacao, setNomeVotacao] = useState("");

    function iniciarVotacao(){
        if (!servicoSelecionado) {
        alert("Selecione um serviço antes de iniciar a votação");
        return;
        }
        socket.send(JSON.stringify({tipo: "iniciar_votacao", servico: servicoSelecionado, nomeVotacao: nomeVotacao}));
        setNomeVotacao("");
    }

    function encerrarVotacao(){
        socket.send(JSON.stringify({tipo: "encerrar_votacao"}));
    }

    function resetarVotacao(){
        socket.send(JSON.stringify({tipo: "resetar_votacao"}));
    }

    function HistoricoVotacoes(){
        socket.send(JSON.stringify({tipo: "pedir_historico"}));
    }

    return (
    <div className="container">
        <h2>Painel do Admin</h2>

        <label htmlFor="selectServico">Selecione o serviço para votação:</label>
        <select
            id="selectServico"
            value={servicoSelecionado}
            onChange={(e) => setServicoSelecionado(e.target.value)}>
            <option value=""> -- Selecione -- </option>
            {servicosDisponiveis.map((servico) => (
            <option key={servico} value={servico}>
                {servico}
            </option>))}
        </select>

        <label>
        Nome da Votação:
            <input
                type="text"
                value={nomeVotacao}
                onChange={(e) => setNomeVotacao(e.target.value)}
                placeholder="Digite o nome da votação"
            />
        </label>

        <br /><br />

        <button onClick={iniciarVotacao}>Iniciar Votação</button>
        <button onClick={encerrarVotacao}>Encerrar Votação</button>
        <button onClick={resetarVotacao}>Resetar Votação</button>
        <button onClick={HistoricoVotacoes}>Historico Votação</button>
    </div>
    );
}