// js/main.js - VERSIÓN ULTRA-BLINDADA OPTIMIZADA (CON ESTRELLAS DE RECUERDO)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//Galaxia principal
import { crearSistemaSolar, actualizarOrbitas, planetas3D, solMesh,
        cinturonAsteroides, crearConstelacionNombre, crearFondoEstrellas,
        crearEstrellasRecuerdos, estrellasRecuerdos, crearPortalInterdimensional,
        portalInterdimensional
     } from './galaxia.js';

     //Dimension 2
import { crearNuevaDimensionInteractiva, animarNuevaDimension, estrellasConstelacionObjetos } from './dimension2.js';

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
let activandoHiperespacio = false;
let activandoHiperespacioVuelta = false;
let dimensionActual = 1;

// 🎵 Playlists separadas por dimensión
const PLAYLIST_D1 = [
    { titulo: "Eclipse Solar - Morat", archivo: "assets/musica/Morat - Eclipse Solar.mp3" },
    { titulo: "Te amo y mas - The Book of life", archivo: "assets/musica/The Book of life - Te amo y mas.mp3" },
    { titulo: "Por el resto de mi vida - Andres Cepeda", archivo: "assets/musica/Andres Cepeda - Por el resto de mi vida.mp3" },
    { titulo: "Photograph - Ed Sheeran", archivo: "assets/musica/Ed Sheeran - Photograph.mp3" },
    { titulo: "Eres Tú - Morat", archivo: "assets/musica/Morat - Eres Tú.mp3" }
];

const PLAYLIST_D2 = [
    { titulo: "En un solo día - Morat", archivo: "assets/musica/Morat - En un solo día.mp3" },
    { titulo: "Sin maquillar - Andrés Obregón", archivo: "assets/musica/Andrés Obregón - Sin maquillar.mp3" },
    { titulo: "Aprender a quererte - Morat", archivo: "assets/musica/Morat - Aprenderte a quererte.mp3" },
    { titulo: "Mi bendición - Juan Luis Guerra", archivo: "assets/musica/Juan Luis Guerra - Mi bendición.mp3" },
    { titulo: "Cuando nadie ve - Morat", archivo: "assets/musica/Morat - Cuando Nadie Ve.mp3" }
];

let playlistActual = PLAYLIST_D1;
let indiceMusicaActual = 0;

// ✨ Sistema de partículas para explosión cósmica al abrir recuerdos
function explosionCosmica(posicionMundo) {
    const cuentaParticulas = 60;
    const geometria = new THREE.BufferGeometry();
    const posiciones = new Float32Array(cuentaParticulas * 3);
    const velocidades = [];
    
    for (let i = 0; i < cuentaParticulas; i++) {
        posiciones[i * 3] = posicionMundo.x;
        posiciones[i * 3 + 1] = posicionMundo.y;
        posiciones[i * 3 + 2] = posicionMundo.z;
        
        const angulo = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const velocidad = 0.08 + Math.random() * 0.2;
        
        velocidades.push({
            vx: Math.sin(phi) * Math.cos(angulo) * velocidad,
            vy: Math.sin(phi) * Math.sin(angulo) * velocidad,
            vz: Math.cos(phi) * velocidad,
            vida: 1.0
        });
    }
    
    geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    
    const canvasParticula = document.createElement('canvas');
    canvasParticula.width = 32;
    canvasParticula.height = 32;
    const ctx = canvasParticula.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(216, 180, 254, 1.0)');
    grad.addColorStop(0.3, 'rgba(168, 85, 247, 0.7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    
    const materialParticulas = new THREE.PointsMaterial({
        size: 0.6,
        map: new THREE.CanvasTexture(canvasParticula),
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particulas = new THREE.Points(geometria, materialParticulas);
    particulas.userData = { velocidades, vida: 1.0 };
    escena.add(particulas);
    
    // Animación de las partículas
    function animarParticulas() {
        const pos = particulas.geometry.attributes.position.array;
        let todasMuertas = true;
        
        for (let i = 0; i < velocidades.length; i++) {
            velocidades[i].vida -= 0.012;
            
            if (velocidades[i].vida > 0) {
                todasMuertas = false;
                pos[i * 3] += velocidades[i].vx;
                pos[i * 3 + 1] += velocidades[i].vy;
                pos[i * 3 + 2] += velocidades[i].vz;
            }
        }
        
        particulas.geometry.attributes.position.needsUpdate = true;
        particulas.material.opacity = Math.max(0, velocidades[0].vida);
        
        if (todasMuertas || velocidades[0].vida <= 0) {
            escena.remove(particulas);
            particulas.geometry.dispose();
            particulas.material.dispose();
        } else {
            requestAnimationFrame(animarParticulas);
        }
    }
    
    animarParticulas();
}

const posMundoAux = new THREE.Vector3(); 

const contenedor = document.getElementById('canvas-container');
const btnEntrar = document.getElementById('btn-entrar');
const pantallaBienvenida = document.getElementById('bienvenida');
const bandaSonora = document.getElementById('banda-sonora');
const modal = document.getElementById('modal-recuerdo');
const cuerpoModal = document.getElementById('cuerpo-modal');
const btnCerrarModal = document.getElementById('btn-cerrar');


function mostrarIndicadorDimension(texto) {
    const indicador = document.getElementById('indicador-dimension');
    const textoDim = document.getElementById('texto-dimension');
    
    textoDim.textContent = texto;
    indicador.classList.remove('visible');
    
    // Forzar reflow para reiniciar la animación
    void indicador.offsetWidth;
    
    indicador.classList.add('visible');
    
    // Se oculta automáticamente al terminar la animación (3s)
    setTimeout(() => {
        indicador.classList.remove('visible');
    }, 3000);
}

function init() {
    escena = new THREE.Scene();
    
    // ==========================================================================
    // ✔️ FIX DE NIEBLA: Cambiamos a niebla lineal de rango amplio para no opacar el fondo
    // ==========================================================================
    escena.fog = new THREE.Fog(0x050508, 90, 400); 

    camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camara.position.set(0, 20, 35); 

renderizador = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
});
renderizador.sortObjects = true;
renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
contenedor.appendChild(renderizador.domElement);
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
renderizador.setClearColor(0x050508, 1);

    controles = new OrbitControls(camara, renderizador.domElement);
    controles.enableDamping = true; 
    controles.dampingFactor = 0.08;     // Más inercia = movimiento más fluido
    controles.maxDistance = 150; 
    controles.minDistance = 5;          // Permite acercarse más

    controles.enablePan = true;
    controles.panSpeed = 1.2;
    controles.rotateSpeed = 0.8;        // Giro más suave
    controles.zoomSpeed = 1.5;          // Zoom más responsivo

    controles.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,   
        MIDDLE: THREE.MOUSE.DOLLY,  
        RIGHT: THREE.MOUSE.PAN      
    };

    controles.touches = {
        ONE: THREE.TOUCH.ROTATE,     
        TWO: THREE.TOUCH.DOLLY_PAN   
    };

    controles.addEventListener('start', () => {
        modoCinematico = false;
    });

    // ==========================================================================
    // ESCUDO ANTI-BLOQUEOS (Añade estas líneas justo aquí abajo)
    // ==========================================================================
    renderizador.domElement.addEventListener('dragstart', (e) => {
        e.preventDefault();
    }, { passive: false });

    renderizador.domElement.addEventListener('selectstart', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Luz ambiental que apoya suavemente la escena
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.6);
    escena.add(luzAmbiental);

    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 1.5; 

    mouse = new THREE.Vector2();

    crearSistemaSolar(escena);
    crearConstelacionNombre(escena, 'ISKEL');
    crearFondoEstrellas(escena);
    crearEstrellasRecuerdos(escena);
    crearPortalInterdimensional(escena);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onPlanetClick);
    
    btnCerrarModal.addEventListener('click', cerrarRecuerdo);
    btnEntrar.addEventListener('click', iniciarExperiencia);

    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');

    btnPlayPause.addEventListener('click', togglePlayPause);
    btnNext.addEventListener('click', siguienteCancion);
    btnPrev.addEventListener('click', anteriorCancion);

    // ==========================================================================
// 🕹️ BOTONES DE NAVEGACIÓN MÓVIL
// ==========================================================================
document.getElementById('btn-acercar').addEventListener('click', () => {
    const direccion = new THREE.Vector3();
    direccion.subVectors(controles.target, camara.position).normalize();
    camara.position.addScaledVector(direccion, 5);
    controles.update();
});

document.getElementById('btn-alejar').addEventListener('click', () => {
    const direccion = new THREE.Vector3();
    direccion.subVectors(controles.target, camara.position).normalize();
    camara.position.addScaledVector(direccion, -5);
    controles.update();
});

document.getElementById('btn-reset-vista').addEventListener('click', () => {
    if (modoCinematico || activandoHiperespacio || activandoHiperespacioVuelta) return;
    objetivoCamara = null;
    modoCinematico = false;
    regresandoAOrigen = true;
    document.body.style.cursor = 'default';
});

// ==========================================================================
// ⌨️ ATAJOS DE TECLADO PARA PC
// ==========================================================================
window.addEventListener('keydown', (e) => {
    // No activar si se está escribiendo en un input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key.toLowerCase()) {
        case 'r':
            if (!modoCinematico && !activandoHiperespacio && !activandoHiperespacioVuelta) {
                objetivoCamara = null;
                modoCinematico = false;
                regresandoAOrigen = true;
                document.body.style.cursor = 'default';
            }
            break;
        case 'f':
            if (!document.fullscreenElement) {
                document.body.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen();
            }
            break;
        case 'm':
            togglePlayPause();
            break;
        case 'arrowright':
            siguienteCancion();
            break;
        case 'arrowleft':
            anteriorCancion();
            break;
    }
});

    cargarCancion(indiceMusicaActual);

    animar();
}

function iniciarExperiencia() {
    pantallaBienvenida.style.opacity = '0';
    setTimeout(() => {
        pantallaBienvenida.style.visibility = 'hidden';
    }, 1000);

    bandaSonora.play()
        .then(() => {
            document.getElementById('btn-play-pause').innerText = "⏸";
        })
        .catch(err => console.log("Audio de fondo listo. Esperando interacción."));
}

function onMouseMove(event) {
    if (modoCinematico || activandoHiperespacio || activandoHiperespacioVuelta) {
        document.body.style.cursor = 'default';
        return; 
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camara);
    
    let objetosInteractivos = [];
    if (dimensionActual === 1) {
        objetosInteractivos = [...planetas3D, solMesh, ...estrellasRecuerdos, portalInterdimensional].filter(Boolean);
    } else if (dimensionActual === 2) {
        objetosInteractivos = [...estrellasConstelacionObjetos].filter(Boolean);
    }

    const intersecciones = raycaster.intersectObjects(objetosInteractivos, true);

    if (intersecciones.length > 0) {
        const objetoDetectado = intersecciones[0].object;

        if (objetoDetectado.userData && (objetoDetectado.userData.nombre || objetoDetectado.userData.titulo || objetoDetectado.userData.esPortalRetorno)) {
            document.body.style.cursor = 'pointer';

            if (planetaApuntado && planetaApuntado !== objetoDetectado) {
                planetaApuntado.userData.pausado = false;
                if (planetaApuntado.userData.atmosfera) {
                    planetaApuntado.userData.atmosfera.material.opacity = 0.25;
                }
            }

            planetaApuntado = objetoDetectado;
            planetaApuntado.userData.pausado = true;

            if (planetaApuntado.userData.atmosfera) {
                planetaApuntado.userData.atmosfera.material.opacity = 0.7;
            }
        }
    } else {
        document.body.style.cursor = 'default';
        
        if (planetaApuntado) {
            planetaApuntado.userData.pausado = false;
            if (planetaApuntado.userData.atmosfera) {
                planetaApuntado.userData.atmosfera.material.opacity = 0.25;
            }
            planetaApuntado = null;
        }
    }
}

function onPlanetClick() {
    if (modoCinematico || bloqueoclic || activandoHiperespacio || activandoHiperespacioVuelta) return; 

    raycaster.setFromCamera(mouse, camara);
    
    let objetosInteractivos = [];

    if (dimensionActual === 1) {
        objetosInteractivos = [...planetas3D, solMesh, ...estrellasRecuerdos, portalInterdimensional].filter(Boolean);
    } 
    else if (dimensionActual === 2) {
        if (typeof estrellasConstelacionObjetos !== 'undefined') {
            objetosInteractivos = [...estrellasConstelacionObjetos].filter(Boolean);
        }
    }

    if (objetosInteractivos.length === 0) return;

    const intersecciones = raycaster.intersectObjects(objetosInteractivos, true);

    if (intersecciones.length > 0) {
        const objetoTocado = intersecciones[0].object;

        // ==========================================
        // 🌀 PORTALES INTERDIMENSIONALES (Viajes)
        // ==========================================
        
        // Ida: De Dimensión 1 a Dimensión 2
        if (dimensionActual === 1 && objetoTocado.userData && objetoTocado.userData.esPortal) {
    // 🎵 Asegurar contexto de audio antes del viaje
    if (bandaSonora.paused) {
        bandaSonora.play().then(() => {
            document.getElementById('btn-play-pause').innerText = "⏸";
        }).catch(() => {});
    }
    activandoHiperespacio = true;
    controles.enabled = false;
    return;
}

        // Vuelta: De Dimensión 2 a Dimensión 1
        if (dimensionActual === 2 && objetoTocado.userData && objetoTocado.userData.esPortalRetorno) {
    // 🎵 Asegurar contexto de audio antes del viaje
    if (bandaSonora.paused) {
        bandaSonora.play().then(() => {
            document.getElementById('btn-play-pause').innerText = "⏸";
        }).catch(() => {});
    }
    activandoHiperespacioVuelta = true;
    controles.enabled = false;
    return;
}
        
        // ==========================================
        // 🔮 LOGICA DE DETECCIÓN DE RECUERDOS (Multimedia y Escritos)
        // ==========================================
        if (objetoTocado.userData && (objetoTocado.userData.nombre || objetoTocado.userData.titulo || objetoTocado.userData.id)) {
            objetivoCamara = objetoTocado;
            modoCinematico = true;
            
            if (objetoTocado.userData.pausado !== undefined) {
                objetoTocado.userData.pausado = true;
            }
            
            controles.enabled = false;
            controles.enableDamping = false;

            if (typeof abrirRecuerdo === 'function') {
                abrirRecuerdo(objetoTocado.userData);
            }
        }
    }
}

function abrirRecuerdo(datos) {
    if (intervaloEscritura) clearInterval(intervaloEscritura);
    
    // ✨ EXPLOSIÓN DE PARTÍCULAS MÁGICAS
    if (objetivoCamara) {
        const posicionExplosion = new THREE.Vector3();
        objetivoCamara.getWorldPosition(posicionExplosion);
        explosionCosmica(posicionExplosion);
    }
    
    const tituloMostrar = datos.nombre || datos.titulo || "Un recuerdo especial";
    cuerpoModal.innerHTML = `<h2>${tituloMostrar}</h2><br>`;

    if (datos.tipo === 'sol') {
        cuerpoModal.innerHTML += `
            <div style="text-align: center;">
                <img src="${datos.contenido}" alt="Nosotros" class="foto-recuerdo" style="border-radius: 12px; max-height: 300px; width: auto; cursor: zoom-in;">
                <p style="margin-top: 15px;">${datos.descripcion}</p>
            </div>
        `;
        setTimeout(() => asociarClickZoom(), 50);
    } 
    else if (datos.tipo === 'foto') {
    cuerpoModal.innerHTML += `
        <div style="text-align:center;">
            <img src="${datos.contenido}" alt="${tituloMostrar}" class="foto-recuerdo" style="max-height:350px; border-radius:8px; cursor: zoom-in;">
        </div>
    `;
    setTimeout(() => asociarClickZoom(), 50);
    
    if (datos.descripcion) {
        const firma = document.createElement('p');
        firma.style.cssText = `
            margin-top: 25px;
            font-family: 'Georgia', 'Playfair Display', 'Times New Roman', serif;
            font-style: italic;
            font-size: 0.95rem;
            color: #c4b5fd;
            text-align: right;
            padding: 12px 18px;
            border-right: 2px solid #a855f7;
            background: rgba(168, 85, 247, 0.06);
            border-radius: 0 8px 8px 0;
            max-width: 280px;
            margin-left: auto;
            animation: desvanecerEntrada 0.8s ease-out;
        `;
        firma.textContent = datos.descripcion;
        cuerpoModal.appendChild(firma);
    }
} 
    else if (datos.tipo === 'video') {
    cuerpoModal.innerHTML += `
        <div style="text-align:center;">
            <video class="video-recuerdo" controls autoplay loop playsinline muted style="max-width:100%; max-height:350px; border-radius:8px; outline:none; box-shadow: 0px 0px 15px rgba(168, 85, 247, 0.3);">
                <source src="${datos.contenido}" type="video/mp4">
                Tu navegador no soporta videos en formato MP4.
            </video>
        </div>
    `;
    
    if (datos.descripcion) {
        const firma = document.createElement('p');
        firma.style.cssText = `
            margin-top: 25px;
            font-family: 'Georgia', 'Playfair Display', 'Times New Roman', serif;
            font-style: italic;
            font-size: 0.95rem;
            color: #c4b5fd;
            text-align: right;
            padding: 12px 18px;
            border-right: 2px solid #a855f7;
            background: rgba(168, 85, 247, 0.06);
            border-radius: 0 8px 8px 0;
            max-width: 280px;
            margin-left: auto;
            animation: desvanecerEntrada 0.8s ease-out;
        `;
        firma.textContent = datos.descripcion;
        cuerpoModal.appendChild(firma);
    }
}
    else if (datos.tipo === 'especial') {
    // 🌟 Contenido especial: puede ser foto O video + poema
    if (datos.foto) {
        cuerpoModal.innerHTML += `
            <div style="text-align:center;">
            <img src="${datos.foto}" alt="${tituloMostrar}" class="foto-recuerdo" style="max-height:220px; max-width:90%; border-radius:12px; margin-bottom:20px; box-shadow: 0 8px 24px rgba(168,85,247,0.3); cursor: zoom-in;">
            </div>
        `;
        setTimeout(() => asociarClickZoom(), 50);
    } else if (datos.video) {
        cuerpoModal.innerHTML += `
            <div style="text-align:center;">
            <video class="video-recuerdo" controls autoplay loop playsinline muted style="max-width:100%; max-height:350px; border-radius:8px; outline:none; box-shadow: 0px 0px 15px rgba(168, 85, 247, 0.3);">
                <source src="${datos.video}" type="video/mp4">
                Tu navegador no soporta videos en formato MP4.
            </video>
            </div>
        `;
    }
    
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
            if (datos.descripcion) {
                const firma = document.createElement('p');
                firma.style.cssText = `
                    margin-top: 25px;
                    font-family: 'Georgia', 'Playfair Display', 'Times New Roman', serif;
                    font-style: italic;
                    font-size: 0.95rem;
                    color: #c4b5fd;
                    text-align: right;
                    padding: 12px 18px;
                    border-right: 2px solid #a855f7;
                    background: rgba(168, 85, 247, 0.06);
                    border-radius: 0 8px 8px 0;
                    max-width: 280px;
                    margin-left: auto;
                    animation: desvanecerEntrada 0.8s ease-out;
                `;
                firma.textContent = datos.descripcion;
                cuerpoModal.appendChild(firma);
            }
            
            clearInterval(intervaloEscritura);
            document.body.style.cursor = 'default';
            if (planetaApuntado) {
                planetaApuntado.userData.pausado = false;
                if (planetaApuntado.userData.atmosfera) {
                    planetaApuntado.userData.atmosfera.material.opacity = 0.25;
                }
                planetaApuntado = null;
            }
        }
    }, 65);
}
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
                if (datos.descripcion) {
                    const firma = document.createElement('p');
                    firma.style.cssText = `
                        margin-top: 25px;
                        font-family: 'Georgia', 'Playfair Display', 'Times New Roman', serif;
                        font-style: italic;
                        font-size: 0.95rem;
                        color: #c4b5fd;
                        text-align: right;
                        padding: 12px 18px;
                        border-right: 2px solid #a855f7;
                        background: rgba(168, 85, 247, 0.06);
                        border-radius: 0 8px 8px 0;
                        max-width: 280px;
                        margin-left: auto;
                        animation: desvanecerEntrada 0.8s ease-out;
                    `;
                    firma.textContent = datos.descripcion;
                    cuerpoModal.appendChild(firma);
                }
                
                clearInterval(intervaloEscritura);
                document.body.style.cursor = 'default';
                if (planetaApuntado) {
                    planetaApuntado.userData.pausado = false;
                    if (planetaApuntado.userData.atmosfera) {
                        planetaApuntado.userData.atmosfera.material.opacity = 0.25;
                    }
                    planetaApuntado = null;
                }
            }
        }, 65);
    }

    // ✨ Explosión de partículas en la posición del recuerdo
if (objetivoCamara) {
    const posMundo = new THREE.Vector3();
    objetivoCamara.getWorldPosition(posMundo);
    explosionCosmica(posMundo);
}

    modal.classList.remove('oculto');
}

function cerrarRecuerdo() {
    modal.classList.add('oculto');
    bloqueoclic = true; 
    
    if (objetivoCamara) {
        if (objetivoCamara.userData.atmosfera) {
            objetivoCamara.userData.atmosfera.material.opacity = 0.25;
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

function animar() {
    requestAnimationFrame(animar);
    
    const tiempoMili = window.performance.now();
    const tiempoSeg = tiempoMili * 0.001;
    
    if (typeof actualizarOrbitas === 'function' && dimensionActual === 1) {
        actualizarOrbitas();
    }
    
    // ==========================================
    // 🎥 MODO CINEMÁTICO: ENFOQUE DE ELEMENTOS
    // ==========================================
    if (modoCinematico && objetivoCamara) {
    if (objetivoCamara.userData && objetivoCamara.userData.worldPosition) {
        posMundoAux.copy(objetivoCamara.userData.worldPosition);
    } else {
        objetivoCamara.getWorldPosition(posMundoAux);
    }
    
    const esSol = objetivoCamara.userData && objetivoCamara.userData.tipo === 'sol';
    const idCuerpo = objetivoCamara ? objetivoCamara.userData.id : null; 
    const esEstreyaRecuerdo = (typeof idCuerpo === 'string' && idCuerpo.startsWith('recuerdo_'));
    
    const radioCuerpo = esSol ? 4.5 : ((objetivoCamara.userData && objetivoCamara.userData.tamano) || 1.5);

    const offsetZ = esSol ? 22 : (esEstreyaRecuerdo ? 12 : (radioCuerpo * 4) + 5);
    const offsetY = esSol ? 8  : (esEstreyaRecuerdo ? 3  : (radioCuerpo * 1.5) + 2);
    
    const posicionObjetivo = new THREE.Vector3(posMundoAux.x, posMundoAux.y + offsetY, posMundoAux.z + offsetZ);

    if (!isNaN(posicionObjetivo.x) && !isNaN(posicionObjetivo.z)) {
        camara.position.lerp(posicionObjetivo, 0.08);
        controles.target.lerp(posMundoAux, 0.08);
    }

    if (camara.position.distanceTo(posicionObjetivo) < 0.1) {
        modoCinematico = false;
    }
}

    // ==========================================
    // 🔙 REGRESO MANUAL AL CENTRO
    // ==========================================
    else if (regresandoAOrigen) {
        const posicionGlobal = dimensionActual === 1 ? new THREE.Vector3(0, 20, 35) : new THREE.Vector3(0, 12, 55);
        const centroUniverso = new THREE.Vector3(0, 0, 0);
        
        camara.position.lerp(posicionGlobal, 0.05);
        controles.target.lerp(centroUniverso, 0.05);

        if (controles.target.distanceTo(centroUniverso) < 0.3) {
            controles.enableDamping = false; 

            controles.target.copy(centroUniverso); 
            camara.position.copy(posicionGlobal);
            
            regresandoAOrigen = false; 
            controles.update();        
            controles.enableDamping = true; 
            
            if (dimensionActual === 1 && typeof planetas3D !== 'undefined') {
                planetas3D.forEach(p => { if(p.userData) p.userData.pausado = false; });
            }
        }
    }
    
    // ==========================================
    // 🚀 EFECTO CINEMÁTICO: VIAJE DE IDA (Hacia Dimensión 2)
    // ==========================================
    if (activandoHiperespacio) {
        if (camara.fov < 140) {
            camara.fov += 1.5; 
            camara.updateProjectionMatrix();
            
            const posicionPortal = portalInterdimensional.position;
            const direccionViaje = new THREE.Vector3();
            direccionViaje.subVectors(posicionPortal, camara.position).normalize();
            
            const velocidadSalto = 1.8;
            camara.position.addScaledVector(direccionViaje, velocidadSalto);
            controles.target.copy(posicionPortal);
            
            if (camara.fov >= 135) {
                document.getElementById('telon-interdimensional').classList.add('activo');
            }
            
        } else {
            activandoHiperespacio = false;
            console.log("¡Cambiando de dimensión en la oscuridad!");
            
            // 🛡️ Forzamos ocultación absoluta y reseteamos objetivos colgantes antes de cambiar de dimensión
            objetivoCamara = null; 
            modoCinematico = false;

            escena.traverse((objeto) => {
                if (objeto !== escena && objeto !== camara) {
                    objeto.visible = false; 
                }
            });
            
            camara.fov = 60;
            camara.updateProjectionMatrix();
            camara.position.set(0, 12, 72); 
            controles.target.set(0, 0, 0);
            
            dimensionActual = 2; 
            cambiarPlaylist(PLAYLIST_D2);
            mostrarIndicadorDimension('Constelaciones Lejanas · Donde Habitan Recuerdos');
            
            if (typeof crearNuevaDimensionInteractiva === 'function') {
                crearNuevaDimensionInteractiva(escena); 
            }
            
            controles.update();
            
            setTimeout(() => {
                document.getElementById('telon-interdimensional').classList.remove('activo');
                controles.enabled = true; 
            }, 400);
        }
    }

    // ==========================================
    // 🚀 EFECTO CINEMÁTICO: VIAJE DE VUELTA (Hacia Dimensión 1)
    // ==========================================
    if (activandoHiperespacioVuelta) {
        if (camara.fov < 140) {
            camara.fov += 1.5; 
            camara.updateProjectionMatrix();
            
            const portalRetorno = estrellasConstelacionObjetos.find(obj => obj.userData && obj.userData.esPortalRetorno);
            
            if (portalRetorno) {
                const posPortal = new THREE.Vector3();
                portalRetorno.getWorldPosition(posPortal);
                
                const direccionViaje = new THREE.Vector3();
                direccionViaje.subVectors(posPortal, camara.position).normalize();
                
                const velocidadSalto = 1.8;
                camara.position.addScaledVector(direccionViaje, velocidadSalto);
                controles.target.copy(posPortal);
            }
            
            if (camara.fov >= 135) {
                document.getElementById('telon-interdimensional').classList.add('activo');
            }
        } else {
            activandoHiperespacioVuelta = false;
            console.log("Regresando a la galaxia clásica en la oscuridad...");
            
            // 🛡️ Limpieza total de objetivos de cámara residuales de la D2
            objetivoCamara = null;
            modoCinematico = false;

            const objetosAEliminar = [];
            escena.traverse((objeto) => {
                if (objeto.userData && (objeto.userData.esNuevaDimension || objeto.userData.esCorazon || objeto.userData.esNodoMultimedia || objeto.userData.esPortalRetorno || objeto.userData.esAurora)) {
                    objetosAEliminar.push(objeto);
                }
            });
            objetosAEliminar.forEach(obj => escena.remove(obj));

            escena.traverse((objeto) => {
                if (objeto !== escena && objeto !== camara) {
                    objeto.visible = true;
                }
            });

            camara.fov = 60;
            camara.updateProjectionMatrix();
            camara.position.set(0, 20, 35);
            controles.target.set(0, 0, 0);

            dimensionActual = 1;
            cambiarPlaylist(PLAYLIST_D1);
            mostrarIndicadorDimension('Sistema Solar · Nuestro Origen');
            controles.update();

            setTimeout(() => {
                document.getElementById('telon-interdimensional').classList.remove('activo');
                controles.enabled = true;
                
                if (typeof planetas3D !== 'undefined') {
                    planetas3D.forEach(p => { if (p.userData) p.userData.pausado = false; });
                }
            }, 400);
        }
    }

    // ==========================================================================
    // 🌀 ANIMACIÓN INTERNA DEL VÓRTICE PRINCIPAL (ROTACIÓN DIFERENCIAL)
    // ==========================================================================
    if (typeof portalInterdimensional !== 'undefined' && portalInterdimensional && portalInterdimensional.visible) {
        portalInterdimensional.rotation.z += 0.0003; 

        const posiciones = portalInterdimensional.geometry.attributes.position.array;
        const datos = portalInterdimensional.userData.datosParticulas;
        
        const rNucleo = portalInterdimensional.userData.radioNúcleo;
        const rMax = portalInterdimensional.userData.largoCuchillaMax;
        const torsion = portalInterdimensional.userData.torsiónExtrema;
        const nCuchillas = portalInterdimensional.userData.numeroCuchillas;

        if (datos && posiciones) {
            for (let i = 0; i < datos.length; i++) {
                const pData = datos[i];

                const factorGiroVortice = 1.0 / (pData.fraccionLargo * 1.5 + 0.12);
                const velocidadAbanico = tiempoSeg * (0.06 * factorGiroVortice);

                const radioActual = rNucleo + pData.fraccionLargo * (rMax - rNucleo);
                const anguloTorsion = Math.pow(pData.fraccionLargo, 1.8) * torsion;
                const anguloBase = (pData.cuchilla * Math.PI * 2) / nCuchillas;
                const anguloFinal = anguloBase + anguloTorsion + velocidadAbanico;

                let dispersionModificada = pData.dispersion;

                if (pData.tipo === 'nucleo') {
                    const factorNucleo = pData.fraccionLargo < 0.08 ? 0.4 : 0.9;
                    dispersionModificada = pData.dispersion * factorNucleo;
                } else if (pData.tipo === 'cuchilla') {
                    const factorBrazo = 0.9 + pData.fraccionLargo * 0.7;
                    dispersionModificada = pData.dispersion * factorBrazo;
                }

                const idx = i * 3;
                posiciones[idx]     = Math.cos(anguloFinal) * radioActual + Math.cos(anguloFinal + Math.PI / 2) * dispersionModificada;
                posiciones[idx + 1] = pData.ejeY * (1.0 - pData.fraccionLargo * 0.4); 
                posiciones[idx + 2] = Math.sin(anguloFinal) * radioActual + Math.sin(anguloFinal + Math.PI / 2) * dispersionModificada;
            }
            portalInterdimensional.geometry.attributes.position.needsUpdate = true;
        }
    }

    // ==========================================
    // ✨ ANIMACIÓN DE TITILEO 
    // ==========================================
    if (typeof estrellasConstelacionObjetos !== 'undefined' && estrellasConstelacionObjetos.length > 0) {
        const tiempoTitileo = tiempoMili * 0.003; 
        
        estrellasConstelacionObjetos.forEach((estrella) => {
            if (estrella.visible && estrella.userData && !estrella.userData.esPortalRetorno) {
                const ud = estrella.userData;
                const factorBucle = Math.sin(tiempoTitileo + (ud.fase || 0));
                
                if (ud.esNodoMultimedia) {
                    estrella.material.size = ud.sizeBase || 1.1;
                    estrella.material.opacity = 0.65 + (factorBucle * 0.35); 
                } else {
                    const multiplicadorGlow = ud.esCorazon ? 1.3 : 1.0;
                    estrella.material.size = (ud.sizeBase || 0.8) * (multiplicadorGlow + factorBucle * 0.2);
                    estrella.material.opacity = 0.7 + (factorBucle * 0.2);
                }
            }
        });
    }

    // ==========================================
    // ☄️ ANIMACIÓN INTERNA DEL CINTURÓN DE ASTEROIDES
    // ==========================================
    if (typeof cinturonAsteroides !== 'undefined' && cinturonAsteroides && cinturonAsteroides.visible) {
        const posiciones = cinturonAsteroides.geometry.attributes.position.array;
        const datos = cinturonAsteroides.userData.datosOrbitas || cinturonAsteroides.userData.datosOrbita;

        if (datos) {
            for (let i = 0; i < datos.length; i++) {
                datos[i].angulo += datos[i].velocidad;
                const idx = i * 3;
                posiciones[idx]     = Math.cos(datos[i].angulo) * datos[i].radio; 
                posiciones[idx + 2] = Math.sin(datos[i].angulo) * datos[i].radio; 
            }
            cinturonAsteroides.geometry.attributes.position.needsUpdate = true;
        }
    }

    if (dimensionActual === 2 && typeof animarNuevaDimension === 'function') {
        animarNuevaDimension(); 
    }
    
    controles.update(); 
    renderizador.render(escena, camara);
}

function cargarCancion(indice) {
    bandaSonora.src = playlistActual[indice].archivo;
    document.getElementById('player-titulo').innerText = playlistActual[indice].titulo;
    bandaSonora.load();
}

function togglePlayPause() {
    const btn = document.getElementById('btn-play-pause');
    if (bandaSonora.paused) {
        bandaSonora.play().then(() => {
            btn.innerText = "⏸";
        }).catch(err => console.log("Error al reproducir"));
    } else {
        bandaSonora.pause();
        btn.innerText = "▶";
    }
}

function siguienteCancion() {
    indiceMusicaActual = (indiceMusicaActual + 1) % playlistActual.length;
    cargarCancion(indiceMusicaActual);
    bandaSonora.play().then(() => {
        document.getElementById('btn-play-pause').innerText = "⏸";
    }).catch(() => {});
}

function anteriorCancion() {
    indiceMusicaActual = (indiceMusicaActual - 1 + playlistActual.length) % playlistActual.length;
    cargarCancion(indiceMusicaActual);
    bandaSonora.play().then(() => {
        document.getElementById('btn-play-pause').innerText = "⏸";
    }).catch(() => {});
}

function cambiarPlaylist(nuevaPlaylist) {
    playlistActual = nuevaPlaylist;
    indiceMusicaActual = 0;
    cargarCancion(indiceMusicaActual);
    
    // Intentar reproducir (funciona si ya había música sonando)
    if (!bandaSonora.paused) {
        bandaSonora.play().then(() => {
            document.getElementById('btn-play-pause').innerText = "⏸";
        }).catch(() => {});
    } else {
        // Si estaba pausada, forzamos reproducción con el contexto del clic
        bandaSonora.play().then(() => {
            document.getElementById('btn-play-pause').innerText = "⏸";
        }).catch(() => {
            // Si falla, al menos dejamos todo listo para que el usuario
            // solo tenga que darle play manualmente
            document.getElementById('btn-play-pause').innerText = "▶";
        });
    }
}

init();