document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-comentario");
    const lista = document.getElementById("lista-comentarios");

    // Envia comentário para o servidor
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (nome === "" || mensagem === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        fetch("http://localhost:3000/comentarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, mensagem }),
        })
            .then((res) => res.json())
            .then((dados) => {
                if (dados.status === "sucesso") {
                    const novoComentario = document.createElement("div");
                    novoComentario.innerHTML = `<strong>${nome}</strong>: ${mensagem} <br><hr>`;
                    lista.prepend(novoComentario);
                    form.reset();
                } else {
                    alert("Erro ao enviar comentário.");
                }
            })
            .catch(() => {
                alert("Erro de conexão com o servidor.");
            });
    });

    // Carrega os comentários salvos
    function carregarComentarios() {
        fetch("http://localhost:3000/comentarios")
            .then((res) => res.json())
            .then((dados) => {
                lista.innerHTML = ""; // Limpa antes de adicionar
                dados.forEach((comentario) => {
                    const item = document.createElement("div");
                    item.innerHTML = `<strong>${comentario.nome}</strong> (${comentario.data}): ${comentario.mensagem}<br><hr>`;
                    lista.appendChild(item);
                });
            })
            .catch(() => {
                console.log("Erro ao carregar comentários.");
            });
    }

    carregarComentarios(); // Carrega ao abrir a página
});
