import { useEffect, useState } from "react";
import { API_URL } from "../config";

function Dashboard({ usuarioLogado, grupos, abrirGrupo, abrirLista }) {
  const [listasRecentes, setListasRecentes] = useState([]);
  const [listasPorGrupo, setListasPorGrupo] = useState({});
  const [paginaGrupos, setPaginaGrupos] = useState(0);
  const [paginaListas, setPaginaListas] = useState(0);

  useEffect(() => {
    carregarListasDosGrupos();
  }, [grupos]);

  function carregarListasDosGrupos() {
    const todasAsListas = [];
    const listasAgrupadas = {};

    if (grupos.length === 0) {
      setListasRecentes([]);
      setListasPorGrupo({});
      return;
    }

    grupos.forEach((grupo) => {
      fetch(`${API_URL}/grupos/${grupo.id}/listas`)
        .then((resposta) => resposta.json())
        .then((listas) => {
          listasAgrupadas[grupo.id] = listas;

          listas.forEach((lista) => {
            todasAsListas.push({
              ...lista,
              grupoTitulo: grupo.titulo,
            });
          });

          setListasPorGrupo({ ...listasAgrupadas });
          setListasRecentes([...todasAsListas].slice(0, 6));
        })
        .catch((erro) => {
          console.error("Erro ao buscar listas do grupo:", erro);
        });
    });
  }

  const gruposLimitados = grupos.slice(0, 6);
  const listasLimitadas = listasRecentes.slice(0, 6);

  const gruposVisiveis = gruposLimitados.slice(
    paginaGrupos * 3,
    paginaGrupos * 3 + 3
  );

  const listasVisiveis = listasLimitadas.slice(
    paginaListas * 3,
    paginaListas * 3 + 3
  );

  return (
    <section>
      <h2>Dashboard</h2>

      <p>Bem-vindo, {usuarioLogado.nome}!</p>

      <h3>🏠 Resumo rápido</h3>

      <p>Grupos que você participa: {grupos.length}</p>
      <p>Listas encontradas: {listasRecentes.length}</p>

      <div className="carousel-header">
        <h3>👥 Meus grupos</h3>

        <div className="carousel-controls">
          <button
            disabled={paginaGrupos === 0}
            onClick={() => setPaginaGrupos(paginaGrupos - 1)}
          >
            ←
          </button>

          <button
            disabled={paginaGrupos === 1 || gruposLimitados.length <= 3}
            onClick={() => setPaginaGrupos(paginaGrupos + 1)}
          >
            →
          </button>
        </div>
      </div>

      {gruposVisiveis.length === 0 ? (
        <p>Você ainda não participa de nenhum grupo.</p>
      ) : (
        <div className="cards-grid">
          {gruposVisiveis.map((grupo) => {
            const listasDoGrupo = listasPorGrupo[grupo.id] || [];
            const primeirasListas = listasDoGrupo.slice(0, 3);

            return (
              <div key={grupo.id}>
                <h4>{grupo.titulo}</h4>

                {grupo.criadoPor && <p>Criado por: {grupo.criadoPor.nome}</p>}

                <div className="card-listas">
                  <strong>Listas:</strong>

                  {primeirasListas.length > 0 ? (
                    primeirasListas.map((lista) => (
                      <p key={lista.id}>{lista.titulo}</p>
                    ))
                  ) : (
                    <p>Nenhuma lista ainda</p>
                  )}
                </div>

                <button onClick={() => abrirGrupo(grupo)}>Abrir Grupo</button>
              </div>
            );
          })}
        </div>
      )}

      <div className="carousel-header">
        <h3>📝 Listas recentes</h3>

        <div className="carousel-controls">
          <button
            disabled={paginaListas === 0}
            onClick={() => setPaginaListas(paginaListas - 1)}
          >
            ←
          </button>

          <button
            disabled={paginaListas === 1 || listasLimitadas.length <= 3}
            onClick={() => setPaginaListas(paginaListas + 1)}
          >
            →
          </button>
        </div>
      </div>

      {listasVisiveis.length === 0 ? (
        <p>Nenhuma lista encontrada ainda.</p>
      ) : (
        <div className="cards-grid">
          {listasVisiveis.map((lista) => (
            <div key={lista.id}>
              <h4>{lista.titulo}</h4>
              <p>Grupo: {lista.grupoTitulo}</p>
              <p>Status: {lista.status}</p>

              <div className="card-actions">
                <button onClick={() => abrirLista(lista)}>Abrir Lista</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;