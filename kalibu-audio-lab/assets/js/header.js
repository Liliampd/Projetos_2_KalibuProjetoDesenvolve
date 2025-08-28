(() => {
  const liAdmin = document.getElementById('menu-admin');
  if (!liAdmin) return;

  // começa oculto
  liAdmin.style.display = 'none';

  const API = (window.API || 'http://localhost:4000').replace(/\/$/, '');
  const token = localStorage.getItem('kalibu_token');
  if (!token) return; // não logado => não mostra

  fetch(`${API}/auth/perfil`, {
    headers: { Authorization: 'Bearer ' + token },
    credentials: 'include'
  })
    .then(r => (r.ok ? r.json() : Promise.reject()))
    .then(d => {
      const isAdmin =
        d && d.ok && d.usuario &&
        (d.usuario.is_admin === true ||
         d.usuario.is_admin === 1 ||
         d.usuario.is_admin === '1');

      if (isAdmin) {
        // mostre o item do menu (ajuste conforme seu layout)
        liAdmin.style.display = 'inline-block';
      }
    })
    .catch(() => {
      // erro => deixa escondido
      liAdmin.style.display = 'none';
    });
})();
