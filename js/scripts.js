// Datos para validar barrios de Bogotá
const barriosBogota = [
  "chapinero", "suba", "usaquén", "teusaquillo", "barrios unidos", "fontibón",
  "engativá", "kennedy", "san cristóbal", "ciudad bolívar", "rafael uribe uribe",
  "santa fe", "sumapaz", "la candelaria", "bosa", "tunjuelito", "usme", "antonio nariño"
];

// Centros de urgencias según EPS y barrios (ejemplo simplificado)
const centrosUrgencias = {
  "Sura": [
    { barrio: "chapinero", nombre: "Clínica Chapinero Sura", direccion: "Calle 53 # 13-50", telefono: "1234567" },
    { barrio: "suba", nombre: "Hospital Suba Sura", direccion: "Av Suba # 100-20", telefono: "7654321" },
  ],
  "Sanitas": [
    { barrio: "usaquén", nombre: "Clínica Usaquén Sanitas", direccion: "Carrera 7 # 150-30", telefono: "2345678" },
    { barrio: "kennedy", nombre: "Hospital Kennedy Sanitas", direccion: "Av Kennedy # 42-10", telefono: "8765432" },
  ],
  "Coomeva": [
    { barrio: "barrios unidos", nombre: "Clínica Barrios Unidos Coomeva", direccion: "Calle 72 # 20-15", telefono: "3456789" }
  ],
  "Compensar": [
    { barrio: "teusaquillo", nombre: "Clínica Teusaquillo Compensar", direccion: "Carrera 24 # 40-10", telefono: "9876543" }
  ],
  "Nueva EPS": [
    { barrio: "engativá", nombre: "Hospital Engativá Nueva EPS", direccion: "Av Boyacá # 120-80", telefono: "4567890" }
  ],
  "Colsanitas": [
    { barrio: "santa fe", nombre: "Clínica Santa Fe Colsanitas", direccion: "Calle 22 # 8-30", telefono: "5678901" }
  ],
  "Otra": []
};

function validarDireccionBogota(direccion) {
  direccion = direccion.toLowerCase();

  if (direccion.includes("bogotá") || direccion.includes("bogota")) {
    return true;
  }
  for (const barrio of barriosBogota) {
    if (direccion.includes(barrio)) {
      return true;
    }
  }
  return false;
}

function validarDatosPersonales() {
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const eps = document.getElementById('eps').value;
  const direccion = document.getElementById('direccion').value.trim();

  if (!nombre || !correo || !telefono || !eps || !direccion) {
    alert('Por favor completa todos los campos.');
    return false;
  }

  // Validar teléfono (10 dígitos numéricos)
  const telRegex = /^\d{10}$/;
  if (!telRegex.test(telefono)) {
    alert('El teléfono debe tener exactamente 10 números.');
    return false;
  }

  // Validar dirección
  if (!validarDireccionBogota(direccion)) {
    alert('Por favor ingresa una dirección o barrio válido dentro de Bogotá.');
    return false;
  }

  // Si pasa validaciones, pasa a la siguiente pantalla
  document.getElementById('pantalla-datos').style.display = 'none';
  document.getElementById('pantalla-sintomas').style.display = 'block';

  return false; // Para que no recargue la página
}

function mostrarOpcionesGenero() {
  const genero = document.getElementById('genero').value;
  const edadInput = document.getElementById('edad').value;
  const edad = parseInt(edadInput);
  const embarazoDiv = document.getElementById('embarazo-container');

  if (genero === 'mujer' && !isNaN(edad) && edad >= 12) {
    embarazoDiv.style.display = 'block';
  } else {
    embarazoDiv.style.display = 'none';
    document.getElementById('embarazo').value = 'no';
  }
}

function evaluar() {
  const edadInput = document.getElementById('edad').value;
  const edad = parseInt(edadInput);
  if (isNaN(edad) || edad < 0) {
    alert("Por favor ingresa una edad válida.");
    return false;
  }

  const genero = document.getElementById('genero').value;
  if (!genero) {
    alert("Por favor selecciona un género.");
    return false;
  }

  const embarazo = document.getElementById('embarazo').value;

  // Obtener condiciones seleccionadas
  const condiciones = Array.from(document.querySelectorAll('input[name="condiciones"]:checked')).map(el => el.value);
  if (condiciones.includes("ninguna") && condiciones.length > 1) {
    alert("Si seleccionas 'Ninguna', no selecciones otras condiciones.");
    return false;
  }

  // Obtener síntomas seleccionados
  const sintomas = Array.from(document.querySelectorAll('input[name="sintomas"]:checked')).map(el => el.value);
  if (sintomas.length === 0) {
    alert("Por favor selecciona al menos un síntoma o 'Ninguno'.");
    return false;
  }
  if (sintomas.includes("ninguno") && sintomas.length > 1) {
    alert("Si seleccionas 'Ninguno', no selecciones otros síntomas.");
    return false;
  }

  let riesgo = 0;
  const esNino = edad < 12;

  if (edad >= 65) riesgo += 2;
  else if (edad >= 45) riesgo += 1;

  const condicionesRiesgo = condiciones.filter(c => c !== "ninguna").length;
  riesgo += condicionesRiesgo >= 2 ? 2 : condicionesRiesgo;

  const sintomasGraves = ["pecho", "dificultad", "convulsiones", "desmayo"];
  const sintomasModerados = ["fiebre", "tos", "mareo", "nauseas", "dolor_estomacal"];
  const sintomasLeves = ["erupcion"];

  sintomas.forEach(s => {
    if (sintomasGraves.includes(s)) riesgo += 3;
    else if (sintomasModerados.includes(s)) riesgo += 1;
    else if (sintomasLeves.includes(s)) riesgo += 0.5;
  });

  if (genero === "mujer" && embarazo === "si") riesgo += 2;

  let mensaje = "";

  if (esNino) {
    if (sintomas.includes("convulsiones") || sintomas.includes("desmayo") || sintomas.includes("dificultad")) {
      mensaje = "🚨 Niño con síntomas graves: acudir de inmediato al hospital.";
    } else if (sintomas.includes("fiebre") && edad < 3) {
      mensaje = "⚠️ Niño menor de 3 años con fiebre: consultar pediatra urgentemente.";
    }
  }

  if (!mensaje) {
    if (riesgo >= 6) {
      mensaje = "🔴 Riesgo alto: busca atención médica URGENTE.";
    } else if (riesgo >= 3) {
      mensaje = "🟡 Riesgo medio: consulta médica recomendada pronto.";
    } else {
      mensaje = "🟢 Riesgo bajo: puedes permanecer en casa y monitorear tus síntomas.";
    }
  }

  // Mostrar resultado
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.textContent = mensaje;

  // Colores azules según riesgo
  if (mensaje.includes("🔴")) {
    resultadoDiv.className = 'alto';
  } else if (mensaje.includes("🟡")) {
    resultadoDiv.className = 'medio';
  } else if (mensaje.includes("🟢")) {
    resultadoDiv.className = 'bajo';
  } else {
    resultadoDiv.className = '';
  }

  // Mostrar centros urgencias
  mostrarCentrosUrgencias();

  return false; // evitar submit real
}

function mostrarCentrosUrgencias() {
  const eps = document.getElementById('eps').value;
  const direccion = document.getElementById('direccion').value.toLowerCase();

  const centrosDiv = document.getElementById('centros-urgencias');
  centrosDiv.innerHTML = "<h2>Centros de urgencias cercanos según EPS y barrio</h2>";

  if (!eps || !centrosUrgencias[eps] || centrosUrgencias[eps].length === 0) {
    centrosDiv.innerHTML += "<p>No hay centros registrados para tu EPS.</p>";
    return;
  }

  // Buscar centros que coincidan con el barrio
  const centros = centrosUrgencias[eps].filter(c => direccion.includes(c.barrio));

  if (centros.length === 0) {
    centrosDiv.innerHTML += "<p>No se encontraron centros cercanos a tu barrio, aquí algunas opciones de tu EPS:</p>";
    centrosUrgencias[eps].forEach(c => {
      centrosDiv.innerHTML += `<p><b>${c.nombre}</b><br>Dirección: ${c.direccion}<br>Teléfono: ${c.telefono}</p>`;
    });
  } else {
    centrosDiv.innerHTML += "<p>Estos son los centros de urgencias cercanos a tu barrio:</p>";
    centros.forEach(c => {
      centrosDiv.innerHTML += `<p><b>${c.nombre}</b><br>Dirección: ${c.direccion}<br>Teléfono: ${c.telefono}</p>`;
    });
  }
}
