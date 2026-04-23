async function cargarProyecto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    const API_URL = "https://script.google.com/macros/s/AKfycbzsXr-GZIB2M1f3KKBi3x54tpePk-XXg-1UG4t9SYeSLK77-1OXDN5ccKC0yntB1D07/exec";

    const res = await fetch(`${API_URL}?sheet=proyectos`);
    const proyectos = await res.json();

    const proyecto = proyectos.find(p => p.id === id);

    if (!proyecto) {
      document.getElementById("proyectoDetalle").innerHTML = "<p>Proyecto no encontrado</p>";
      return;
    }

    renderProyecto(proyecto);

  } catch (error) {
    console.error("Error cargando proyecto:", error);
  }
}

function getImagePath(img) {
  const BASE_PATH = location.hostname.includes("github.io")
    ? "/LienzaEstudio"
    : "";

  // Si es URL externa (Drive, etc)
  if (img.startsWith('http')) return img;

  // Si es imagen local
  return `${BASE_PATH}/${img}`;
}

function fixDriveUrl(url) {
  if (url.includes("drive.google.com")) {
    const match = url.match(/id=([^&]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return url;
}

function renderProyecto(p) {
  const container = document.getElementById("proyectoDetalle");

  container.innerHTML = `

    <section class="proyecto-header">
        <h1>${p.titulo}</h1>
        <span>${p.ubicacion} · ${p.anio}</span>
    </section>

    <section class="proyecto-imagen-principal">
        ${p.imagenes.map(img => `
            <img src="${getImagePath(fixDriveUrl(img))}" alt="${p.titulo}">
        `).join('')}
    </section>

    <section class="proyecto-descripcion">
        <p>${p.descripcion}</p>
    </section>

    <section class="proyecto-galeria">
        ${p.imagenes.map(img => `
            <img src="${getImagePath(fixDriveUrl(img))}" alt="">
        `).join('')}
    </section>

    `;
}

cargarProyecto();
