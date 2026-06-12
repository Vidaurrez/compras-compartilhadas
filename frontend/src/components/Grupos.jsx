function Grupos({ grupos }) {
  return (
    <section>
      <h2>Grupos</h2>

      <div>
        {grupos.map((grupo) => (
          <div key={grupo.id}>
            <h3>{grupo.titulo}</h3>

            {grupo.criadoPor && (
              <p>Criado por: {grupo.criadoPor.nome}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Grupos;