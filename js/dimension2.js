import * as THREE from 'three';
import { CONFIG_UNIVERSO } from './recuerdos.js';

let grupoDimension2 = null;
let nubesNebulosa = null;
let fondoEstrellasD2 = null; 
let portalRetornoMesh = null; 

export let estrellasConstelacionObjetos = []; 

const datosFlotacionNebulosa = [];

export function crearNuevaDimensionInteractiva(scene) {
    grupoDimension2 = new THREE.Group();
    grupoDimension2.userData = { esNuevaDimension: true };
    estrellasConstelacionObjetos = []; 

    // ==========================================================================
    // 🎨 1. TEXTURAS DE DISEÑO (RE-CALIBRADAS Y CORREGIDAS)
    // ==========================================================================
    
    // 💜 Estrellas de la silueta del corazón (Fiel a tu diseño original)
    const canvasPasivo = document.createElement('canvas');
    canvasPasivo.width = 32; canvasPasivo.height = 32;
    const ctxPas = canvasPasivo.getContext('2d');
    const gradPas = ctxPas.createRadialGradient(16, 16, 0, 16, 16, 14);
    gradPas.addColorStop(0, 'rgba(244, 63, 94, 1.0)'); 
    gradPas.addColorStop(0.2, 'rgba(236, 72, 153, 0.9)');   
    gradPas.addColorStop(0.5, 'rgba(168, 85, 247, 0.5)'); 
    gradPas.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctxPas.fillStyle = gradPas; ctxPas.fillRect(0, 0, 32, 32);
    const texturaPasiva = new THREE.CanvasTexture(canvasPasivo);

    // ✨ Nodos Multimedia de Recuerdos (Suaves, circulares y orgánicos, sin la cruz rígida)
    const canvasClickeable = document.createElement('canvas');
    canvasClickeable.width = 64; canvasClickeable.height = 64;
    const ctxCli = canvasClickeable.getContext('2d');
    const gradCli = ctxCli.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradCli.addColorStop(0, 'rgba(255, 255, 255, 1.0)'); 
    gradCli.addColorStop(0.2, 'rgba(255, 255, 255, 1.0)');  
    gradCli.addColorStop(0.4, 'rgba(34, 211, 238, 0.9)'); 
    gradCli.addColorStop(0.7, 'rgba(34, 211, 238, 0.3)'); 
    gradCli.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctxCli.fillStyle = gradCli; ctxCli.beginPath(); ctxCli.arc(32, 32, 30, 0, Math.PI * 2); ctxCli.fill();
    const texturaClickeable = new THREE.CanvasTexture(canvasClickeable);

    // 🔮 Textura del Vórtice Lila (¡Solución al 404! Generada e inicializada correctamente aquí)
    const canvasBrilloVortex = document.createElement('canvas');
    canvasBrilloVortex.width = 64; canvasBrilloVortex.height = 64;
    const ctxVort = canvasBrilloVortex.getContext('2d');
    const gradVort = ctxVort.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradVort.addColorStop(0, 'rgba(255, 255, 255, 1.0)');     
    gradVort.addColorStop(0.2, 'rgba(216, 180, 254, 0.85)');   
    gradVort.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');    
    gradVort.addColorStop(1, 'rgba(0, 0, 0, 0)');              
    ctxVort.fillStyle = gradVort; ctxVort.beginPath(); ctxVort.arc(32, 32, 30, 0, Math.PI * 2); ctxVort.fill();
    const texturaPortalLila = new THREE.CanvasTexture(canvasBrilloVortex);

// ==========================================================================
// 🌌 2. FONDO DE ESTRELLAS MEJORADO CON TEXTURA ORGÁNICA
// ==========================================================================
    const cuentaEstrellasFondo = 1500;
    const geoFondo = new THREE.BufferGeometry();
    const posFondo = new Float32Array(cuentaEstrellasFondo * 3);
    const coloresFondo = new Float32Array(cuentaEstrellasFondo * 3);

    const paletaEstrellasD2 = [
        new THREE.Color(0xffffff),  // Blanco puro
        new THREE.Color(0xd4c4ff),  // Lila suave
        new THREE.Color(0xa5d8ff),  // Azul celeste
        new THREE.Color(0xffd4f0),  // Rosa pálido
    ];

    for (let i = 0; i < cuentaEstrellasFondo; i++) {
        const idx = i * 3;
        posFondo[idx]     = (Math.random() - 0.5) * 400;
        posFondo[idx + 1] = (Math.random() - 0.5) * 400;
        posFondo[idx + 2] = (Math.random() - 0.5) * 400;

    const colorElegido = paletaEstrellasD2[Math.floor(Math.random() * paletaEstrellasD2.length)];
        coloresFondo[idx]     = colorElegido.r;
        coloresFondo[idx + 1] = colorElegido.g;
        coloresFondo[idx + 2] = colorElegido.b;
    }

    geoFondo.setAttribute('position', new THREE.BufferAttribute(posFondo, 3));
    geoFondo.setAttribute('color', new THREE.BufferAttribute(coloresFondo, 3));

    // 🌟 Crear textura de estrella orgánica (brillo radial suave)
    const canvasEstrellaD2 = document.createElement('canvas');
    canvasEstrellaD2.width = 64;
    canvasEstrellaD2.height = 64;
    const ctxD2 = canvasEstrellaD2.getContext('2d');

    const gradienteD2 = ctxD2.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradienteD2.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradienteD2.addColorStop(0.05, 'rgba(255, 255, 255, 0.95)');
    gradienteD2.addColorStop(0.2, 'rgba(220, 210, 255, 0.7)');
    gradienteD2.addColorStop(0.5, 'rgba(160, 140, 255, 0.15)');
    gradienteD2.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctxD2.fillStyle = gradienteD2;
    ctxD2.fillRect(0, 0, 64, 64);

    const texturaEstrellaD2 = new THREE.CanvasTexture(canvasEstrellaD2);

    fondoEstrellasD2 = new THREE.Points(geoFondo, new THREE.PointsMaterial({
        size: 2.5 + Math.random() * 1.5,
        vertexColors: true,
        map: texturaEstrellaD2,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    }));
    grupoDimension2.add(fondoEstrellasD2);

    // ==========================================================================
    // 🌌 PARTE A: NEBULOSA
    // ==========================================================================
    const cuentaParticulas = 600; 
    const geomNebulosa = new THREE.BufferGeometry();
    const posNebulosa = new Float32Array(cuentaParticulas * 3);
    const colNebulosa = new Float32Array(cuentaParticulas * 3);
    const paletaNebulosa = [new THREE.Color(0xa855f7), new THREE.Color(0xec4899), new THREE.Color(0x3b82f6)];

    for (let i = 0; i < cuentaParticulas; i++) {
        const r = 18 + Math.random() * 22;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const idx = i * 3;
        posNebulosa[idx]     = r * Math.sin(phi) * Math.cos(theta);
        posNebulosa[idx + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7; 
        posNebulosa[idx + 2] = r * Math.cos(phi);

        const col = paletaNebulosa[Math.floor(Math.random() * paletaNebulosa.length)];
        colNebulosa[idx]     = col.r;
        colNebulosa[idx + 1] = col.g;
        colNebulosa[idx + 2] = col.b;

        datosFlotacionNebulosa.push({
            velX: (Math.random() - 0.5) * 0.004, velY: (Math.random() - 0.5) * 0.006, velZ: (Math.random() - 0.5) * 0.004,
            faseX: Math.random() * Math.PI * 2, faseY: Math.random() * Math.PI * 2, faseZ: Math.random() * Math.PI * 2,
            amplitud: 0.015
        });
    }
    geomNebulosa.setAttribute('position', new THREE.BufferAttribute(posNebulosa, 3));
    geomNebulosa.setAttribute('color', new THREE.BufferAttribute(colNebulosa, 3));

    const canvasNube = document.createElement('canvas');
    canvasNube.width = 64; canvasNube.height = 64;
    const ctxNube = canvasNube.getContext('2d');
    const gradNube = ctxNube.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradNube.addColorStop(0, 'rgba(255, 255, 255, 0.12)'); 
    gradNube.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
    gradNube.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctxNube.fillStyle = gradNube; ctxNube.fillRect(0, 0, 64, 64);

    nubesNebulosa = new THREE.Points(geomNebulosa, new THREE.PointsMaterial({
        size: 7.0, vertexColors: true, transparent: true, opacity: 0.35,
        map: new THREE.CanvasTexture(canvasNube), blending: THREE.AdditiveBlending, depthWrite: false
    }));
    grupoDimension2.add(nubesNebulosa);

    // ==========================================================================
    // ❤️ PARTE B: CONSTELACIÓN DEL CORAZÓN
    // ==========================================================================
    const estrellasEnCorazon = 140; 
    const factorEscala = 0.70; 
    const contornoGrupo = new THREE.Group(); 

    for (let i = 0; i < estrellasEnCorazon; i++) {
        const t = (i / estrellasEnCorazon) * Math.PI * 2;
        const xBase = 16 * Math.pow(Math.sin(t), 3);
        const yBase = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        const zEspesor = (Math.random() - 0.5) * 1.0; 

        const geomEstreya = new THREE.BufferGeometry();
        geomEstreya.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            xBase * factorEscala, yBase * factorEscala, zEspesor
        ]), 3));

        const starMesh = new THREE.Points(geomEstreya, new THREE.PointsMaterial({
            size: 1.4 + Math.random() * 0.6, 
            transparent: true, opacity: 0.85, map: texturaPasiva,
            blending: THREE.AdditiveBlending, depthWrite: false
        }));

        starMesh.userData = { esCorazon: true, sizeBase: starMesh.material.size, fase: Math.random() * Math.PI * 2 };
        contornoGrupo.add(starMesh);
    }
    grupoDimension2.add(contornoGrupo);

    // ==========================================================================
    // ✨ PARTE C: ESTRELLAS INTERACTIVAS (EXCLUSIVAS DE LA DIMENSIÓN 2)
    // ==========================================================================
    const nodosCorazon = CONFIG_UNIVERSO.dimension2 || [];

    nodosCorazon.forEach((nodo, indices) => {
        const xBase = 16 * Math.pow(Math.sin(nodo.t), 3);
        const yBase = 13 * Math.cos(nodo.t) - 5 * Math.cos(2*nodo.t) - 2 * Math.cos(3*nodo.t) - Math.cos(4*nodo.t);

        const geomNodo = new THREE.BufferGeometry();
        geomNodo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            xBase * factorEscala, yBase * factorEscala, 0
        ]), 3));

        const nodoMesh = new THREE.Points(geomNodo, new THREE.PointsMaterial({
            size: 2.8, 
            transparent: true, opacity: 1.0, map: texturaClickeable,
            blending: THREE.AdditiveBlending, depthWrite: false
        }));
        
        nodoMesh.userData = {
            id: `nodo_corazon_interactivo_${indices}`, 
            tipo: nodo.tipo, 
            nombre: nodo.titulo,
            titulo: nodo.titulo, 
            descripcion: nodo.descripcion, 
            contenido: nodo.contenido, 
            sizeBase: nodoMesh.material.size,
            fase: Math.random() * Math.PI * 2, 
            esNodoMultimedia: true 
        };

        grupoDimension2.add(nodoMesh);
        estrellasConstelacionObjetos.push(nodoMesh);
    });

    // Nodo Núcleo Alfa (El Poema Central permanece intacto)
    const geomAlfa = new THREE.BufferGeometry();
    geomAlfa.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0.5, 0]), 3));

    const nucleoAlfaMesh = new THREE.Points(geomAlfa, new THREE.PointsMaterial({
        size: 3.8, 
        transparent: true, opacity: 1.0, map: texturaClickeable,
        blending: THREE.AdditiveBlending, depthWrite: false
    }));
    
    nucleoAlfaMesh.userData = {
    id: 'recuerdo_nucleo_escrito', 
    tipo: 'especial', 
    nombre: 'El Escrito Central',
    titulo: 'LA PROMESA',
    foto: 'assets/fotos/SGCAM_20260531_113905510.jpg',
    contenido: `Aquí estoy y estaré para tí, hasta que la ultima estrella se apague.
                Mi corazón permanecerá contigo, y mis manos estarán para ayudarte cuando el tuyo lo pida.
                Cada vez que pienses que las estrellas se apagan o que el mundo se empieza a caer, vuelve aquí a nuestro propio rincón del universo, donde habitan nuestros recuerdos,
                nuestro amor y vuelve a sentir ese abrazo calido en tú corazón.`,
    descripcion: '— Del niño que te ama, para su niña hermosa 💜',
    sizeBase: nucleoAlfaMesh.material.size, 
    fase: Math.random() * Math.PI * 2, 
    esNodoMultimedia: true 
};

    grupoDimension2.add(nucleoAlfaMesh);
    estrellasConstelacionObjetos.push(nucleoAlfaMesh);

    // ==========================================================================
    // 🔮 PARTE D: PORTAL DE RETORNO ORIGINAL (ESTRUCTURA INTACTA)
    // ==========================================================================
    const cuentaParticulasPortal = 6000; 
    const geoPortalRetorno = new THREE.BufferGeometry();
    const posPortalRetorno = new Float32Array(cuentaParticulasPortal * 3);
    const datosParticulasPortal = [];

    const numCuchillas = 6;              
    const radioNúcleoD2 = 0.05;          
    const maxLargoCuchilla = 7.0;        
    const torsionPortal = 2.0;           

    for (let i = 0; i < cuentaParticulasPortal; i++) {
        const aleatorioTipo = Math.random();
        
        let tipoParticula = 'gas'; 
        let fracLargo = Math.pow(Math.random(), 2.2); 
        let cuchillaAct = i % numCuchillas;
        let dispCuchilla = 0;
        let espesorY = 0;

        if (aleatorioTipo < 0.25) {
            tipoParticula = 'nucleo';
            fracLargo = Math.pow(Math.random(), 3) * 0.15;
            cuchillaAct = Math.floor(Math.random() * numCuchillas);
            
            const anchoNucleo = 0.8 * (1.0 - fracLargo / 0.15); 
            dispCuchilla = (Math.random() - 0.5) * anchoNucleo;
            espesorY = (Math.random() - 0.5) * anchoNucleo * 0.8;
        } 
        else if (aleatorioTipo < 0.90) {
            tipoParticula = 'cuchilla';
            const baseAncho = 1.8; 
            const anchoCuchilla = (1.0 - fracLargo * 0.4) * baseAncho;
            dispCuchilla = (Math.random() - 0.5) * anchoCuchilla;
            espesorY = (Math.random() - 0.5) * 0.18 * (1.0 - fracLargo * 0.5);
        } 
        else {
            tipoParticula = 'gas';
            fracLargo = Math.random();
            dispCuchilla = (Math.random() - 0.5) * 3.2 * (1.0 - fracLargo * 0.3);
            espesorY = (Math.random() - 0.5) * 1.1 * (1.0 - fracLargo * 0.5);
        }

        const radioFinal = radioNúcleoD2 + fracLargo * (maxLargoCuchilla - radioNúcleoD2);
        const anguloTorsion = Math.pow(fracLargo, 1.8) * torsionPortal;
        const anguloBase = (cuchillaAct * Math.PI * 2) / numCuchillas;
        const anguloFinal = anguloBase + anguloTorsion;

        const x = Math.cos(anguloFinal) * radioFinal + Math.cos(anguloFinal + Math.PI / 2) * dispCuchilla;
        const z = Math.sin(anguloFinal) * radioFinal + Math.sin(anguloFinal + Math.PI / 2) * dispCuchilla;
        const y = espesorY;

        const idx = i * 3;
        posPortalRetorno[idx] = x;
        posPortalRetorno[idx + 1] = y;
        posPortalRetorno[idx + 2] = z;

        datosParticulasPortal.push({
            tipo: tipoParticula,
            fraccionLargo: fracLargo,
            cuchilla: cuchillaAct,
            dispersion: dispCuchilla,
            ejeY: y
        });
    }

    geoPortalRetorno.setAttribute('position', new THREE.BufferAttribute(posPortalRetorno, 3));

    portalRetornoMesh = new THREE.Points(geoPortalRetorno, new THREE.PointsMaterial({
        color: 0xf5f3ff, 
        size: 0.50,                  
        map: texturaPortalLila, 
        transparent: true, 
        opacity: 0.95,              
        blending: THREE.AdditiveBlending, 
        depthWrite: false,
        sizeAttenuation: true
    }));

    portalRetornoMesh.position.set(22, 6, -15);
    portalRetornoMesh.rotation.x = Math.PI / 2.15; 

    // Mantenemos tus nombres originales exactos de userData para la física de main.js
    portalRetornoMesh.userData = { 
        esPortalRetorno: true, 
        id: 'portal_retorno_dimension2',
        datosParticulas: datosParticulasPortal,
        radioNúcleo: radioNúcleoD2,
        maxLargoCuchilla: maxLargoCuchilla,
        torsionPortal: torsionPortal,
        numCuchillas: numCuchillas
    };

    grupoDimension2.add(portalRetornoMesh);
    estrellasConstelacionObjetos.push(portalRetornoMesh);
    
// ==========================================================================
// 🌌 AURORA BOREAL CÓSMICA (Partículas fluidas que envuelven el espacio)
// ==========================================================================
const particulasAurora = 2000;
const geometriaAurora = new THREE.BufferGeometry();
const posicionesAurora = new Float32Array(particulasAurora * 3);
const coloresAurora = new Float32Array(particulasAurora * 3);
const datosAurora = [];

const paletaAurora = [
    new THREE.Color('#a855f7'), // Lila
    new THREE.Color('#7c3aed'), // Violeta
    new THREE.Color('#06b6d4'), // Cian
    new THREE.Color('#22d3ee'), // Celeste
    new THREE.Color('#ec4899'), // Rosa
    new THREE.Color('#c084fc'), // Lavanda
];

for (let i = 0; i < particulasAurora; i++) {
    const radio = 22 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 1.2;
    
    const x = Math.cos(theta) * Math.cos(phi) * radio;
    const y = Math.sin(phi) * radio * 0.6;
    const z = Math.sin(theta) * Math.cos(phi) * radio;
    
    const idx = i * 3;
    posicionesAurora[idx] = x;
    posicionesAurora[idx + 1] = y;
    posicionesAurora[idx + 2] = z;
    
    const color = paletaAurora[Math.floor(Math.random() * paletaAurora.length)];
    coloresAurora[idx] = color.r;
    coloresAurora[idx + 1] = color.g;
    coloresAurora[idx + 2] = color.b;
    
    datosAurora.push({
        xBase: x,
        yBase: y,
        zBase: z,
        radio,
        theta,
        phi,
        velocidadOnda: 0.3 + Math.random() * 0.8,
        faseX: Math.random() * Math.PI * 2,
        faseY: Math.random() * Math.PI * 2,
        amplitud: 0.4 + Math.random() * 1.8,
        alturaPreferida: y,
    });
}

geometriaAurora.setAttribute('position', new THREE.BufferAttribute(posicionesAurora, 3));
geometriaAurora.setAttribute('color', new THREE.BufferAttribute(coloresAurora, 3));

// Textura de partícula con degradado suave
const canvasAurora = document.createElement('canvas');
canvasAurora.width = 64;
canvasAurora.height = 64;
const ctxAurora = canvasAurora.getContext('2d');
const gradAurora = ctxAurora.createRadialGradient(32, 32, 0, 32, 32, 32);
gradAurora.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
gradAurora.addColorStop(0.15, 'rgba(220, 200, 255, 0.35)');
gradAurora.addColorStop(0.5, 'rgba(150, 120, 220, 0.08)');
gradAurora.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctxAurora.fillStyle = gradAurora;
ctxAurora.fillRect(0, 0, 64, 64);

const texturaAuroraParticula = new THREE.CanvasTexture(canvasAurora);

const materialAuroraParticulas = new THREE.PointsMaterial({
    size: 1.6,
    map: texturaAuroraParticula,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
});

const auroraParticulas = new THREE.Points(geometriaAurora, materialAuroraParticulas);
auroraParticulas.userData = { 
    esAurora: true, 
    datosAurora: datosAurora 
};
grupoDimension2.add(auroraParticulas);
grupoDimension2.userData.auroraParticulas = auroraParticulas;

    scene.add(grupoDimension2);


} 

// ==========================================================================
// 🔮 EXPORT ANIMACIÓN ORIGINAL
// ==========================================================================
export function animarNuevaDimension() {
    const tiempoMili = window.performance.now();
    const tSeg = tiempoMili * 0.001;

    if (nubesNebulosa) {
        const posiciones = nubesNebulosa.geometry.attributes.position.array;
        for (let i = 0; i < datosFlotacionNebulosa.length; i++) {
            const df = datosFlotacionNebulosa[i];
            const idx = i * 3;
            posiciones[idx]     += Math.sin(tSeg * 0.25 + df.faseX) * df.velX * df.amplitud;
            posiciones[idx + 1] += Math.cos(tSeg * 0.25 + df.faseY) * df.velY * df.amplitud;
            posiciones[idx + 2] += Math.sin(tSeg * 0.25 + df.faseZ) * df.velZ * df.amplitud;
        }
        nubesNebulosa.geometry.attributes.position.needsUpdate = true;
    }

    if (portalRetornoMesh) {
        const posiciones = portalRetornoMesh.geometry.attributes.position.array;
        const datos = portalRetornoMesh.userData.datosParticulas;

        const rNucleo = portalRetornoMesh.userData.radioNúcleo;
        const rMax = portalRetornoMesh.userData.maxLargoCuchilla;
        const torsion = portalRetornoMesh.userData.torsionPortal;
        const nCuchillas = portalRetornoMesh.userData.numCuchillas;

        if (datos && posiciones) {
            for (let i = 0; i < datos.length; i++) {
                const pData = datos[i];
                const idx = i * 3;

                const factorGiroD2 = 1.0 / (pData.fraccionLargo * 1.5 + 0.12);
                const velocidadAbanico = tSeg * (0.06 * factorGiroD2); 

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

                posiciones[idx]     = Math.cos(anguloFinal) * radioActual + Math.cos(anguloFinal + Math.PI / 2) * dispersionModificada;
                posiciones[idx + 1] = pData.ejeY * (1.0 - pData.fraccionLargo * 0.4); 
                posiciones[idx + 2] = Math.sin(anguloFinal) * radioActual + Math.sin(anguloFinal + Math.PI / 2) * dispersionModificada;
            }
            portalRetornoMesh.geometry.attributes.position.needsUpdate = true;
        }
    }


// 🌌 Animación de la aurora boreal (partículas fluidas)
if (grupoDimension2 && grupoDimension2.userData.auroraParticulas) {
    const aurora = grupoDimension2.userData.auroraParticulas;
    const pos = aurora.geometry.attributes.position.array;
    const datos = aurora.userData.datosAurora;
    
    if (datos && pos) {
        for (let i = 0; i < datos.length; i++) {
            const d = datos[i];
            const idx = i * 3;
            
            const nuevoPhi = d.phi + Math.sin(tSeg * d.velocidadOnda + d.faseY) * 0.04;
            const nuevoTheta = d.theta + tSeg * 0.08;
            
            const radioOndulante = d.radio + Math.sin(tSeg * 0.4 + d.faseX) * d.amplitud;
            
            const x = Math.cos(nuevoTheta) * Math.cos(nuevoPhi) * radioOndulante;
            const y = Math.sin(nuevoPhi) * radioOndulante * 0.6;
            const z = Math.sin(nuevoTheta) * Math.cos(nuevoPhi) * radioOndulante;
            
            pos[idx] = x;
            pos[idx + 1] = y + Math.cos(tSeg * 0.5 + d.faseY) * 0.8;
            pos[idx + 2] = z;
        }
        aurora.geometry.attributes.position.needsUpdate = true;
    }
    
    // Sutil cambio de opacidad
    aurora.material.opacity = 0.45 + Math.sin(tSeg * 0.3) * 0.1;
}

}