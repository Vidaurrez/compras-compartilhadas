import { useEffect, useState } from "react";
import Usuarios from "./components/Usuarios";
import Grupos from "./components/Grupos";
import Listas from "./components/Listas";
import Itens from "./components/Itens";
import Compras from "./components/Compras";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import MeusGrupos from "./components/MeusGrupos";
import GrupoDetalhes from "./components/GrupoDetalhes";
import ListaDetalhes from "./components/ListaDetalhes";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [listas, setListas] = useState([]);
  const [itens, setItens] = useState([]);
  const [compras, setCompras] = useState([]);
  const [tela, setTela] = useState("login");
  const [pagina, setPagina] = useState("dashboard");
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [listaSelecionada, setListaSelecionada] = useState(null);

  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");

    if (usuarioSalvo) {
      return JSON.parse(usuarioSalvo);
    }

    return null;
  });

  useEffect(() => {
    fetch("http://localhost:8080/usuarios")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setUsuarios(dados);
      })
      .catch((erro) => {
        console.error("Erro ao buscar usuários:", erro);
      });

    fetch("http://localhost:8080/listas")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setListas(dados);
      })
      .catch((erro) => {
        console.error("Erro ao buscar listas:", erro);
      });

    fetch("http://localhost:8080/itens")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setItens(dados);
      })
      .catch((erro) => {
        console.error("Erro ao buscar itens:", erro);
      });

    fetch("http://localhost:8080/compras")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setCompras(dados);
      })
      .catch((erro) => {
        console.error("Erro ao buscar compras:", erro);
      });
  }, []);

  useEffect(() => {
    if (usuarioLogado) {
      carregarGruposDoUsuario();
    }
  }, [usuarioLogado]);

  function realizarLogin(usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    setUsuarioLogado(usuario);
    setPagina("dashboard");
  }

  function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    setGrupoSelecionado(null);
    setListaSelecionada(null);
    setTela("login");
    setPagina("dashboard");
  }

  function carregarGruposDoUsuario() {
    fetch(`http://localhost:8080/usuarios/${usuarioLogado.id}/grupos`)
      .then((resposta) => resposta.json())
      .then((dados) => setGrupos(dados))
      .catch((erro) => console.error("Erro ao buscar grupos:", erro));
  }

  function abrirGrupo(grupo) {
    setGrupoSelecionado(grupo);
    setListaSelecionada(null);
    setPagina("grupoDetalhes");
  }

  function abrirLista(lista) {
    setListaSelecionada(lista);
    setPagina("listaDetalhes");
  }

  function voltarParaGrupos() {
    setGrupoSelecionado(null);
    setListaSelecionada(null);
    setPagina("grupos");
  }

  function voltarParaGrupoDetalhes() {
    setListaSelecionada(null);
    setPagina("grupoDetalhes");
  }

  if (!usuarioLogado && tela === "login") {
    return (
      <Login
        onLogin={realizarLogin}
        irParaCadastro={() => setTela("cadastro")}
      />
    );
  }

  if (!usuarioLogado && tela === "cadastro") {
    return (
      <Cadastro
        onCadastro={realizarLogin}
        voltarParaLogin={() => setTela("login")}
      />
    );
  }

  return (
    <div>
      <h1>Sistema de Compras Compartilhadas</h1>

      <p>Usuário logado: {usuarioLogado.nome}</p>

      <nav>
        <button onClick={() => setPagina("dashboard")}>Dashboard</button>
        <button onClick={() => setPagina("grupos")}>Meus Grupos</button>
        <button onClick={() => setPagina("perfil")}>Perfil</button>
        <button onClick={fazerLogout}>Sair</button>
      </nav>

      <hr />

      {pagina === "dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <p>Bem-vindo, {usuarioLogado.nome}!</p>
        </div>
      )}

      {pagina === "grupos" && (
        <MeusGrupos
          usuarioLogado={usuarioLogado}
          grupos={grupos}
          atualizarGrupos={carregarGruposDoUsuario}
          abrirGrupo={abrirGrupo}
        />
      )}

      {pagina === "grupoDetalhes" && grupoSelecionado && (
        <GrupoDetalhes
          grupo={grupoSelecionado}
          voltar={voltarParaGrupos}
          abrirLista={abrirLista}
        />
      )}

      {pagina === "listaDetalhes" && listaSelecionada && (
        <ListaDetalhes
          lista={listaSelecionada}
          usuarioLogado={usuarioLogado}
          voltar={voltarParaGrupoDetalhes}
        />
      )}

      {pagina === "perfil" && (
        <div>
          <h2>Perfil</h2>
          <p>Nome: {usuarioLogado.nome}</p>
          <p>Email: {usuarioLogado.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;