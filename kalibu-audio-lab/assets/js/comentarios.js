// Espera o DOM carregar
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-comentario");
    const lista = document.getElementById("lista-comentarios");

    // Evento de envio do formulário
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (nome === "" || mensagem === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Exibir o comentário na tela (simulação local)
        const novoComentario = document.createElement("div");
        novoComentario.innerHTML = `<strong>${nome}</strong>: ${mensagem} <br><hr>`;
        lista.prepend(novoComentario);

        // Limpar o formulário
        form.reset();

        // 👉 Aqui futuramente vamos enviar para o PHP/MySQL via fetch()
    });
});
