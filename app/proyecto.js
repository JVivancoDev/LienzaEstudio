async function cargarProyecto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    const res = await fetch("/data/proyectos.json");
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
  if (img.startsWith('http')) return img;
  return encodeURI(img.startsWith('/') ? img : `/${img}`);
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

  // Las imágenes pueden venir como array o como string separado por comas
  const imagenes = Array.isArray(p.imagenes)
    ? p.imagenes
    : String(p.imagenes || "").split(",").map(s => s.trim()).filter(Boolean);

  const superficie = p.superficie ? `
        <div class="proyecto-meta-item">
          <div class="proyecto-meta-label">Superficie</div>
          <div class="proyecto-meta-value">${p.superficie}</div>
        </div>` : "";

  container.innerHTML = `

    <div class="proyecto-volver-wrap">
      <a href="/index.html#proyectos" class="proyecto-volver">
        <span>&larr;</span> Volver a proyectos
      </a>
    </div>

    <section class="proyecto-mosaico">
      ${imagenes.map(img => `
        <img src="${getImagePath(fixDriveUrl(img))}" alt="${p.titulo}">
      `).join('')}
    </section>

    <section class="proyecto-info">
      <div class="proyecto-info-top">
        <h1>${p.titulo}</h1>
        <div class="proyecto-meta">
          <div class="proyecto-meta-item">
            <div class="proyecto-meta-label">Año</div>
            <div class="proyecto-meta-value">${p.anio}</div>
          </div>
          <div class="proyecto-meta-item">
            <div class="proyecto-meta-label">Lugar</div>
            <div class="proyecto-meta-value">${p.ubicacion}</div>
          </div>
          ${superficie}
        </div>
      </div>

      <div class="proyecto-detalle-desc">
        <p>${p.descripcion}</p>
      </div>
    </section>

  `;
}

cargarProyecto();
