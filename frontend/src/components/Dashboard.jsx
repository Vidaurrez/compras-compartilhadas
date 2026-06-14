import { useEffect, useState } from "react";

function Dashboard({ usuarioLogado, grupos, abrirGrupo, abrirLista }) {
  const [listasRecentes, setListasRecentes] = useState([]);

  useEffect(() => {
    carregarListasDosGrupos();
  }, [grupos]);

  function carregarListasDosGrupos() {
    const todasAsListas = [];

    grupos.forEach((grupo) => {
      fetch(`http://localhost:8080/grupos/${grupo.id}/listas`)
        .then((resposta) => resposta.json())
        .then((listas) => {
          listas.forEach((lista) => {
            todasAsListas.push({
              ...lista,
              grupoTitulo: grupo.titulo,
            });
          });

          setListasRecentes([...todasAsListas]);
        })
        .catch((erro) => {
          console.error("Erro ao buscar listas do grupo:", erro);
        });
    });
  }

  return (
    <section>
      <h2>Dashboard</h2>

      <p>Bem-vindo, {usuarioLogado.nome}!</p>

      <h3>Resumo rápido</h3>

      <p>Grupos que você participa: {grupos.length}</p>
      <p>Listas encontradas: {listasRecentes.length}</p>

      <h3>Meus grupos</h3>

      {grupos.length === 0 ? (
        <p>Você ainda não participa de nenhum grupo.</p>
      ) : (
        <div>
          {grupos.map((grupo) => (
            <div key={grupo.id}>
              <h4>{grupo.titulo}</h4>
              <p>Código: {grupo.codigoConvite}</p>

              <button onClick={() => abrirGrupo(grupo)}>
                Abrir Grupo
              </button>
            </div>
          ))}
        </div>
      )}

      <h3>Listas recentes</h3>

      {listasRecentes.length === 0 ? (
        <p>Nenhuma lista encontrada ainda.</p>
      ) : (
        <div>
          {listasRecentes.map((lista) => (
            <div key={lista.id}>
              <h4>{lista.titulo}</h4>
              <p>Grupo: {lista.grupoTitulo}</p>
              <p>Status: {lista.status}</p>

              <button onClick={() => abrirLista(lista)}>
                Abrir Lista
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;