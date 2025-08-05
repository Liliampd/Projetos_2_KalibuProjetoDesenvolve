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

                    const dataAtual = new Date();
                    const dataFormatada = `${dataAtual.getDate().toString().padStart(2, "0")}/${
                        (dataAtual.getMonth() + 1).toString().padStart(2, "0")
                    }/${dataAtual.getFullYear()} ${dataAtual.getHours().toString().padStart(2, "0")}:${
                        dataAtual.getMinutes().toString().padStart(2, "0")
                    }`;

                    novoComentario.innerHTML = `
                        <strong>${nome}</strong> (${dataFormatada}): ${mensagem}
                        <button onclick="this.parentElement.remove()" style="margin-left:10px; color: red;">Excluir</button>
                        <hr>
                    `;
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

    // Carrega os comentários salvos do banco
    function carregarComentarios() {
        fetch("http://localhost:3000/comentarios")
            .then((res) => res.json())
            .then((dados) => {
                lista.innerHTML = "";

                dados.forEach((comentario) => {
                    const item = document.createElement("div");
                    item.innerHTML = `
                        <strong>${comentario.nome}</strong> (${comentario.data}): ${comentario.mensagem}
                        <button onclick="deletarComentario(${comentario.id})" style="margin-left:10px; color: red;">Excluir</button>
                        <hr>
                    `;
                    lista.appendChild(item);
                });
            })
            .catch(() => {
                console.log("Erro ao carregar comentários.");
            });
    }

    carregarComentarios(); // Carrega ao abrir a página
});

// Função global para deletar comentário do banco
function deletarComentario(id) {
    if (confirm("Tem certeza que deseja excluir este comentário?")) {
        fetch(`http://localhost:3000/comentarios/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((dados) => {
                if (dados.status === "sucesso") {
                    // Recarrega a lista após deletar
                    document.querySelector("#lista-comentarios").innerHTML = "";
                    carregarComentarios();
                } else {
                    alert("Erro ao excluir comentário.");
                }
            })
            .catch(() => {
                alert("Erro ao se comunicar com o servidor.");
            });
    }
}
