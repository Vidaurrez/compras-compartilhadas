function Listas({ listas }) {
  return (
    <section>
      <h2>Listas</h2>

      <div>
        {listas.map((lista) => (
          <div key={lista.id}>
            <h3>{lista.titulo}</h3>
            <p>Status: {lista.status}</p>

            {lista.grupo && (
              <p>Grupo: {lista.grupo.titulo}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Listas;