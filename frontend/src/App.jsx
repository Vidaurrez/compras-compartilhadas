import { useEffect, useState } from "react";
import Usuarios from "./components/Usuarios";
import Grupos from "./components/Grupos";
import Listas from "./components/Listas";
import Itens from "./components/Itens";
import Compras from "./components/Compras";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [listas, setListas] = useState([]);
  const [itens, setItens] = useState([]);
  const [compras, setCompras] = useState([]);
  const [tela, setTela] = useState("login");
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

    fetch("http://localhost:8080/grupos")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setGrupos(dados);
      })
      .catch((erro) => {
        console.error("Erro ao buscar grupos:", erro);
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

  function realizarLogin(usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    setUsuarioLogado(usuario);
  }

  function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    setTela("login");
  }

  return (
    <div>
      <h1>Sistema de Compras Compartilhadas</h1>

      <p>Usuário logado: {usuarioLogado.nome}</p>
      <button onClick={fazerLogout}>Sair</button>

      <Usuarios usuarios={usuarios} />

    <hr />

      <Grupos grupos={grupos} />

    <hr />

      <Listas listas={listas} />

    <hr />

      <Itens itens={itens} />

    <hr />

      <Compras compras={compras} />
    </div>
  );
}

export default App;