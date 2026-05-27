// js/main.js - VERSIÓN ULTRA-BLINDADA OPTIMIZADA (CON ESTRELLAS DE RECUERDO)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { crearSistemaSolar, actualizarOrbitas, planetas3D, solMesh,
        cinturonAsteroides, crearConstelacionNombre, crearFondoEstrellas,
        crearEstrellasRecuerdos,
        estrellasRecuerdos } from './galaxia.js';

// --- VARIABLES GLOBALES DE CONTROL ---
let escena, camara, renderizador, controles;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let planetaApuntado = null;
let objetivoCamara = null; 
let modoCinematico = false;
let bloqueoclic = false;
let regresandoAOrigen = false;
let intervaloEscritura = null;

// Vector auxiliar para obtener coordenadas globales en tiempo real
const posMundoAux = new THREE.Vector3(); 

const contenedor = document.getElementById('canvas-container');
const btnEntrar = document.getElementById('btn-entrar');
const pantallaBienvenida = document.getElementById('bienvenida');
const bandaSonora = document.getElementById('banda-sonora');
const modal = document.getElementById('modal-recuerdo');
const cuerpoModal = document.getElementById('cuerpo-modal');
const btnCerrarModal = document.getElementById('btn-cerrar');

// --- 1. INICIALIZACIÓN DEL ENTORNO ---
function init() {
    escena = new THREE.Scene();
    escena.fog = new THREE.FogExp2(0x050508, 0.015); 

    camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camara.position.set(0, 20, 35); 

    renderizador = new THREE.WebGLRenderer({ antialias: true });
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contenedor.appendChild(renderizador.domElement);
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap;

    controles = new OrbitControls(camara, renderizador.domElement);
    controles.enableDamping = true; 
    controles.dampingFactor = 0.05;
    controles.maxDistance = 80;     
    controles.minDistance = 8;      

    const luzAmbiental = new THREE.AmbientLight(0x333355, 1.5);
    escena.add(luzAmbiental);

    raycaster = new THREE.Raycaster();
    // --- INTEGRADO: Burbuja magnética de clic para las partículas de las estrellas ---
    raycaster.params.Points.threshold = 4.0; 

    mouse = new THREE.Vector2();

    // Invocaciones a galaxia.js de forma limpia y ordenada
    crearSistemaSolar(escena);
    crearConstelacionNombre(escena, 'ISKEL');
    crearFondoEstrellas(escena);
    crearEstrellasRecuerdos(escena);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onPlanetClick);
    
    btnCerrarModal.addEventListener('click', cerrarRecuerdo);
    btnEntrar.addEventListener('click', iniciarExperiencia);

    animar();
}

// --- 2. EVENTOS DE INTERACCIÓN ---
function iniciarExperiencia() {
    pantallaBienvenida.style.opacity = '0';
    setTimeout(() => {
        pantallaBienvenida.style.visibility = 'hidden';
    }, 1000);
    
    bandaSonora.play().catch(err => console.log("Audio de fondo listo."));
}

function onMouseMove(event) {
    if (modoCinematico) {
        document.body.style.cursor = 'default';
        return; 
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camara);
    
    // --- MODIFICADO: Combinamos planetas, sol y estrellas de recuerdos para el cambio de cursor ---
    const objetosInteractivos = [...planetas3D, solMesh, ...estrellasRecuerdos].filter(Boolean);
    // Agregamos 'true' para que analice de forma recursiva las colecciones de puntos
    const intersecciones = raycaster.intersectObjects(objetosInteractivos, true);

    if (intersecciones.length > 0) {
        const objetoDetectado = intersecciones[0].object;

        // Si es un planeta o el sol con nombre, o una estrella de recuerdo con userData configurado
        if (objetoDetectado.userData && (objetoDetectado.userData.nombre || objetoDetectado.userData.titulo)) {
            document.body.style.cursor = 'pointer';

            // Lógica de pausa para atmósfera (solo aplica a planetas)
            if (planetaApuntado && planetaApuntado !== objetoDetectado) {
                planetaApuntado.userData.pausado = false;
                if (planetaApuntado.userData.atmosfera) {
                    planetaApuntado.userData.atmosfera.material.opacity = 0.22;
                }
            }

            planetaApuntado = objetoDetectado;
            planetaApuntado.userData.pausado = true;

            if (planetaApuntado.userData.atmosfera) {
                planetaApuntado.userData.atmosfera.material.opacity = 0.6;
            }
        }
    } else {
        document.body.style.cursor = 'default';
        
        if (planetaApuntado) {
            planetaApuntado.userData.pausado = false;
            if (planetaApuntado.userData.atmosfera) {
                planetaApuntado.userData.atmosfera.material.opacity = 0.22;
            }
            planetaApuntado = null;
        }
    }
}

function onPlanetClick() {
    if (modoCinematico || bloqueoclic) return; 

    raycaster.setFromCamera(mouse, camara);
    // --- MODIFICADO: Añadidas las estrellas de recuerdos a la física del impacto del clic ---
    const objetosInteractivos = [...planetas3D, solMesh, ...estrellasRecuerdos].filter(Boolean);
    const intersecciones = raycaster.intersectObjects(objetosInteractivos, true);

    if (intersecciones.length > 0) {
        const objetoTocado = intersecciones[0].object;
        
        if (objetoTocado.userData && (objetoTocado.userData.nombre || objetoTocado.userData.titulo)) {
            objetivoCamara = objetoTocado;
            modoCinematico = true;
            objetivoCamara.userData.pausado = true;
            
            controles.enabled = false;
            controles.enableDamping = false;

            abrirRecuerdo(objetoTocado.userData);
        }
    }
}

function abrirRecuerdo(datos) {
    if (intervaloEscritura) clearInterval(intervaloEscritura);
    
    const tituloMostrar = datos.nombre || datos.titulo || "Un recuerdo especial";
    cuerpoModal.innerHTML = `<h2>${tituloMostrar}</h2><br>`;

    // --- CASE 1: EL SOL CENTRAL ---
    if (datos.tipo === 'sol') {
        cuerpoModal.innerHTML += `
            <div style="text-align: center;">
                <img src="${datos.contenido}" alt="Nosotros" class="foto-recuerdo" style="border-radius: 12px; max-height: 300px; width: auto; cursor: zoom-in;">
                <p style="margin-top: 15px;">${datos.descripcion}</p>
            </div>
        `;
        setTimeout(() => asociarClickZoom(), 50);
    } 
    // --- CASE 2: FOTOS (PLANETAS O ESTRELLAS DE RECUERDO) ---
    else if (datos.tipo === 'foto') {
        cuerpoModal.innerHTML += `
            <div style="text-align:center;">
                <img src="${datos.contenido}" alt="${tituloMostrar}" class="foto-recuerdo" style="max-height:350px; border-radius:8px; cursor: zoom-in;">
                ${datos.descripcion ? `<p style="margin-top: 15px;">${datos.descripcion}</p>` : ''}
            </div>
        `;
        setTimeout(() => asociarClickZoom(), 50);
    } 
    // --- CASE 3: MINI VIDEOS ---
    else if (datos.tipo === 'video') {
        cuerpoModal.innerHTML += `
            <div style="text-align:center;">
                <video class="video-recuerdo" controls autoplay loop playsinline style="max-width:100%; max-height:350px; border-radius:8px; outline:none; box-shadow: 0px 0px 15px rgba(168, 85, 247, 0.3);">
                    <source src="${datos.contenido}" type="video/mp4">
                    Tu navegador no soporta videos en formato MP4.
                </video>
                ${datos.descripcion ? `<p style="margin-top: 15px;">${datos.descripcion}</p>` : ''}
            </div>
        `;
    }
    // --- CASE 4: TEXTO ANIMADO EN MÁQUINA DE ESCRIBIR ---
    else if (datos.tipo === 'texto') {
        const pTexto = document.createElement('p');
        pTexto.className = 'texto-animado';
        cuerpoModal.appendChild(pTexto);
        
        const textoCompleto = datos.contenido;
        let indice = 0;
        
        intervaloEscritura = setInterval(() => {
            if (indice < textoCompleto.length) {
                if (textoCompleto.charAt(indice) === '\n') {
                    pTexto.innerHTML += '<br>';
                } else {
                    pTexto.innerHTML += textoCompleto.charAt(indice);
                }
                indice++;
            } else {
                clearInterval(intervaloEscritura);
                if (datos.descripcion) {
                    cuerpoModal.innerHTML += `<p style="margin-top: 15px; font-style: italic; opacity: 0.7;">${datos.descripcion}</p>`;
                }
            }
        }, 30); 
    }

    modal.classList.remove('oculto');
}

function cerrarRecuerdo() {
    modal.classList.add('oculto');
    bloqueoclic = true; 
    
    if (objetivoCamara) {
        objetivoCamara.userData.pausado = false;
        if (objetivoCamara.userData.atmosfera) {
            objetivoCamara.userData.atmosfera.material.opacity = 0.22;
        }
    }
    
    objetivoCamara = null;
    modoCinematico = false;
    regresandoAOrigen = true; 
    
    controles.enabled = true;
    controles.enableDamping = true;
    document.body.style.cursor = 'default';

    setTimeout(() => {
        bloqueoclic = false;
    }, 500);
}

function asociarClickZoom() {
    const foto = cuerpoModal.querySelector('.foto-recuerdo');
    if (foto) {
        foto.addEventListener('click', () => {
            foto.classList.toggle('foto-expandida');
        });
    }
}

function onWindowResize() {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
}

// --- 4. BUCLE DE ANIMACIÓN INTEGRAL ---
function animar() {
    requestAnimationFrame(animar);
    actualizarOrbitas();
    
    if (modoCinematico && objetivoCamara) {
        objetivoCamara.getWorldPosition(posMundoAux);
        const esSol = (objetivoCamara.userData.tipo === 'sol');
        
        // --- CORRECCIÓN SEGURA: Validamos que id exista y sea un string antes de usar startsWith ---
        const idCuerpo = objetivoCamara.userData.id;
        const esEstrellaRecuerdo = (typeof idCuerpo === 'string' && idCuerpo.startsWith('recuerdo_'));
        
        const radioCuerpo = esSol ? 4.5 : (objetivoCamara.userData.tamano || 1.5);

        // Si es una de las supernovas profundas, le damos una distancia fija y cómoda para enfocarla
        const offsetZ = esSol ? 22 : (esEstrellaRecuerdo ? 12 : (radioCuerpo * 4) + 5);
        const offsetY = esSol ? 8  : (esEstrellaRecuerdo ? 3  : (radioCuerpo * 1.5) + 2);
        
        const posicionObjetivo = new THREE.Vector3(posMundoAux.x, posMundoAux.y + offsetY, posMundoAux.z + offsetZ);

        if (!isNaN(posicionObjetivo.x) && !isNaN(posicionObjetivo.z)) {
            camara.position.lerp(posicionObjetivo, 0.05);
            controles.target.lerp(posMundoAux, 0.05);
        }
    } 
    else if (regresandoAOrigen) {
        const posicionGlobal = new THREE.Vector3(0, 20, 35);
        const centroUniverso = new THREE.Vector3(0, 0, 0);
        
        camara.position.lerp(posicionGlobal, 0.05);
        controles.target.lerp(centroUniverso, 0.05);

        if (controles.target.distanceTo(centroUniverso) < 0.01) {
            controles.target.copy(centroUniverso); 
            regresandoAOrigen = false;             
        }
    }
    
    controles.update();
    renderizador.render(escena, camara);

    if (cinturonAsteroides) {
        const posiciones = cinturonAsteroides.geometry.attributes.position.array;
        const datos = cinturonAsteroides.userData.datosOrbita;

        for (let i = 0; i < datos.length; i++) {
            datos[i].angulo += datos[i].velocidad;
            const idx = i * 3;
            posiciones[idx]     = Math.cos(datos[i].angulo) * datos[i].radio; 
            posiciones[idx + 2] = Math.sin(datos[i].angulo) * datos[i].radio; 
        }
        cinturonAsteroides.geometry.attributes.position.needsUpdate = true;
    }
}

init();