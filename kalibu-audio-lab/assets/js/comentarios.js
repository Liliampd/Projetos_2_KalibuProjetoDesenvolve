document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-comentario");
    const lista = document.getElementById("lista-comentarios");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!nome || !mensagem) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        fetch("http://localhost:3000/comentarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, mensagem }),
        })
            .then((res) => res.json())
            .then((dados) => {
                if (dados.status === "sucesso") {
                    // opção: usar dados.id retornado pelo backend para adicionar imediatamente
                    carregarComentarios();
                    form.reset();
                } else {
                    alert("Erro ao enviar comentário.");
                }
            })
            .catch((err) => {
                console.error("Erro POST:", err);
                alert("Erro de conexão com o servidor.");
            });
    });

    function criarItemComentario(comentario) {
        // comentario deve conter: id, nome, mensagem, data
        const container = document.createElement("div");
        container.className = "comentario-item";

        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";

        const texto = document.createElement("div");
        texto.innerHTML = `<strong>${comentario.nome}</strong> (${comentario.data}): ${comentario.mensagem}`;

        const btn = document.createElement("button");
        btn.textContent = "Excluir";
        btn.style.marginLeft = "10px";
        btn.style.backgroundColor = "black";
        btn.style.color = "red";
        btn.dataset.id = comentario.id; // guarda o id de forma segura

        // evento seguro que lê o dataset
        btn.addEventListener("click", function () {
            const id = this.dataset.id;
            if (!id) {
                alert("ID do comentário inválido.");
                return;
            }
            if (!confirm("Tem certeza que deseja excluir este comentário?")) return;

            fetch(`http://localhost:3000/comentarios/${id}`, { method: "DELETE" })
                .then(res => res.json())
                .then(dados => {
                    if (dados.status === "sucesso") {
                        carregarComentarios();
                    } else {
                        alert("Erro ao excluir comentário.");
                        console.error("Resposta DELETE:", dados);
                    }
                })
                .catch(err => {
                    console.error("Erro DELETE:", err);
                    alert("Erro ao se comunicar com o servidor.");
                });
        });

        header.appendChild(texto);
        header.appendChild(btn);

        container.appendChild(header);
        const hr = document.createElement("hr");
        container.appendChild(hr);

        return container;
    }

    function carregarComentarios() {
        fetch("http://localhost:3000/comentarios")
            .then(res => res.json())
            .then(dados => {
                lista.innerHTML = "";
                if (!Array.isArray(dados)) {
                    console.error("Resposta /comentarios inesperada:", dados);
                    return;
                }
                dados.forEach(comentario => {
                    const item = criarItemComentario(comentario);
                    lista.appendChild(item);
                });
            })
            .catch(err => {
                console.error("Erro ao carregar comentários:", err);
            });
    }

    carregarComentarios();
});
