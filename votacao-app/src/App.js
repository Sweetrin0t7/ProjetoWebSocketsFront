import React from "react";
import AdminPainel from "./components/AdminPainel";
import Votacao from "./components/Votacao";
import Ranking from "./components/Ranking";
import Historico from "./components/Historico";
import './index.css';

function App() {
  return (
    <div>
      <AdminPainel />
      <hr />
      <Votacao />
      <hr />
      <Ranking />
      <hr />
      <Historico />
    </div>
  );
}

export default App;
