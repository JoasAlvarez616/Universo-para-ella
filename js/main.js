// js/main.js - VERSIÓN ULTRA-BLINDADA OPTIMIZADA (CON ESTRELLAS DE RECUERDO)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { crearSistemaSolar, actualizarOrbitas, planetas3D, solMesh,
        cinturonAsteroides, crearConstelacionNombre, crearFondoEstrellas,
        crearEstrellasRecuerdos, estrellasRecuerdos } from './galaxia.js';

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

// Configuración de la lista musical
const PLAYLIST = [
    { titulo: "The Book of life - Te amo y mas", archivo: "assets/musica/The Book of life - Te amo y mas.mp3" },
    { titulo: "Andres Cepeda - Por el resto de mi vida", archivo: "assets/musica/Andres Cepeda - Por el resto de mi vida.mp3" },
    { titulo: "Ed Sheeran - Photograph", archivo: "assets/musica/Ed Sheeran - Photograph.mp3" }
];
let indiceMusicaActual = 0;

const posMundoAux = new THREE.Vector3(); 

const contenedor = document.getElementById('canvas-container');
const btnEntrar = document.getElementById('btn-entrar');
const pantallaBienvenida = document.getElementById('bienvenida');
const bandaSonora = document.getElementById('banda-sonora');
const modal = document.getElementById('modal-recuerdo');
const cuerpoModal = document.getElementById('cuerpo-modal');
const btnCerrarModal = document.getElementById('btn-cerrar');

function init() {
    escena = new THREE.Scene();
    
    // ==========================================================================
    // ✔️ FIX DE NIEBLA: Cambiamos a niebla lineal de rango amplio para no opacar el fondo
    // ==========================================================================
    escena.fog = new THREE.Fog(0x050508, 90, 400); 

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
    controles.maxDistance = 150; // Ampliado para poder alejarse a ver los planetas nuevos
    controles.minDistance = 8;      

    controles.enablePan = true;
    controles.panSpeed = 1.2;
    controles.rotateSpeed = 1.0; 

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

    // Luz ambiental que apoya suavemente la escena
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.6);
    escena.add(luzAmbiental);

    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 4.0; 

    mouse = new THREE.Vector2();

    crearSistemaSolar(escena);
    crearConstelacionNombre(escena, 'ISKEL');
    crearFondoEstrellas(escena);
    crearEstrellasRecuerdos(escena);

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
    if (modoCinematico) {
        document.body.style.cursor = 'default';
        return; 
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camara);
    
    const objetosInteractivos = [...planetas3D, solMesh, ...estrellasRecuerdos].filter(Boolean);
    const intersecciones = raycaster.intersectObjects(objetosInteractivos, true);

    if (intersecciones.length > 0) {
        const objetoDetectado = intersecciones[0].object;

        if (objetoDetectado.userData && (objetoDetectado.userData.nombre || objetoDetectado.userData.titulo)) {
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
    if (modoCinematico || bloqueoclic) return; 

    raycaster.setFromCamera(mouse, camara);
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
                ${datos.descripcion ? `<p style="margin-top: 20px; font-family: 'Poppins', sans-serif, system-ui; font-size: 14px; color: #cbd5e1; line-height: 1.6; max-width: 90%; margin-left: auto; margin-right: auto; padding: 10px 15px; background: rgba(168, 85, 247, 0.08); border-radius: 8px; border-left: 3px solid #06b6d4;">${datos.descripcion}</p>` : ''}
            </div>
        `;
        setTimeout(() => asociarClickZoom(), 50);
    } 
    else if (datos.tipo === 'video') {
        cuerpoModal.innerHTML += `
            <div style="text-align:center;">
                <video class="video-recuerdo" controls autoplay loop playsinline style="max-width:100%; max-height:350px; border-radius:8px; outline:none; box-shadow: 0px 0px 15px rgba(168, 85, 247, 0.3);">
                    <source src="${datos.contenido}" type="video/mp4">
                    Tu navegador no soporta videos en formato MP4.
                </video>
                ${datos.descripcion ? `<p style="margin-top: 20px; font-family: 'Poppins', sans-serif, system-ui; font-size: 14px; color: #cbd5e1; line-height: 1.6; max-width: 90%; margin-left: auto; margin-right: auto; padding: 10px 15px; background: rgba(168, 85, 247, 0.08); border-radius: 8px; border-left: 3px solid #06b6d4;">${datos.descripcion}</p>` : ''}
            </div>
        `;
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
                clearInterval(intervaloEscritura);
                if (datos.descripcion) {
                    const contenedorDesc = document.createElement('div');
                    contenedorDesc.innerHTML = `
                        <p style="margin-top: 25px; font-family: 'Poppins', sans-serif, system-ui; font-size: 14px; color: #cbd5e1; line-height: 1.6; max-width: 90%; margin-left: auto; margin-right: auto; padding: 10px 15px; background: rgba(168, 85, 247, 0.08); border-radius: 8px; border-left: 3px solid #06b6d4; text-align: center;">
                            ${datos.descripcion}
                        </p>
                    `;
                    cuerpoModal.appendChild(contenedorDesc);
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
    
    actualizarOrbitas();
    
    if (modoCinematico && objetivoCamara) {
        objetivoCamara.getWorldPosition(posMundoAux);
        const esSol = (objetivoCamara.userData.tipo === 'sol');
        
        const idCuerpo = objetivoCamara.userData.id;
        const esEstreyaRecuerdo = (typeof idCuerpo === 'string' && idCuerpo.startsWith('recuerdo_'));
        
        const radioCuerpo = esSol ? 4.5 : (objetivoCamara.userData.tamano || 1.5);

        const offsetZ = esSol ? 22 : (esEstreyaRecuerdo ? 12 : (radioCuerpo * 4) + 5);
        const offsetY = esSol ? 8  : (esEstreyaRecuerdo ? 3  : (radioCuerpo * 1.5) + 2);
        
        const posicionObjetivo = new THREE.Vector3(posMundoAux.x, posMundoAux.y + offsetY, posMundoAux.z + offsetZ);

        if (!isNaN(posicionObjetivo.x) && !isNaN(posicionObjetivo.z)) {
            camara.position.lerp(posicionObjetivo, 0.05);
            controles.target.lerp(posMundoAux, 0.05);
        }

        if (camara.position.distanceTo(posicionObjetivo) < 0.1) {
            modoCinematico = false;
        }
    } 
    else if (regresandoAOrigen) {
        const posicionGlobal = new THREE.Vector3(0, 20, 35);
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
            
            if (typeof planetas3D !== 'undefined') {
                planetas3D.forEach(p => p.userData.pausado = false);
            }
        }
    }
    
    // Animación dinámica de la constelación (Titileo)
    if (typeof estrellasConstelacionObjetos !== 'undefined' && estrellasConstelacionObjetos.length > 0) {
        const tiempo = window.performance.now() * 0.003; 
        
        estrellasConstelacionObjetos.forEach((estrella) => {
            const ud = estrella.userData;
            const factorBucle = Math.sin(tiempo + ud.fase);
            const multiplicadorGlow = ud.esCorazon ? 1.4 : 1.1;
            estrella.material.size = ud.sizeBase * (multiplicadorGlow + factorBucle * 0.25);
            estrella.material.opacity = 0.75 + (factorBucle * 0.25);
        });
    }
    
    controles.update(); 
    renderizador.render(escena, camara);

    if (cinturonAsteroides) {
        const posiciones = cinturonAsteroides.geometry.attributes.position.array;
        const datos = cinturonAsteroides.userData.datosOrbitas || cinturonAsteroides.userData.datosOrbita;

        for (let i = 0; i < datos.length; i++) {
            datos[i].angulo += datos[i].velocidad;
            const idx = i * 3;
            posiciones[idx]     = Math.cos(datos[i].angulo) * datos[i].radio; 
            posiciones[idx + 2] = Math.sin(datos[i].angulo) * datos[i].radio; 
        }
        cinturonAsteroides.geometry.attributes.position.needsUpdate = true;
    }
}

function cargarCancion(indice) {
    bandaSonora.src = PLAYLIST[indice].archivo;
    document.getElementById('player-titulo').innerText = PLAYLIST[indice].titulo;
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
    indiceMusicaActual = (indiceMusicaActual + 1) % PLAYLIST.length;
    cargarCancion(indiceMusicaActual);
    bandaSonora.play().then(() => {
        document.getElementById('btn-play-pause').innerText = "⏸";
    }).catch(() => {});
}

function anteriorCancion() {
    indiceMusicaActual = (indiceMusicaActual - 1 + PLAYLIST.length) % PLAYLIST.length;
    cargarCancion(indiceMusicaActual);
    bandaSonora.play().then(() => {
        document.getElementById('btn-play-pause').innerText = "⏸";
    }).catch(() => {});
}

init();