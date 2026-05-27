// js/galaxia.js - VERSIÓN TEXTURA RADIAL BRILLANTE Y TITILEO ORGÁNICO (SIN PARALAJE)
import * as THREE from 'three';
import { CONFIG_UNIVERSO } from './recuerdos.js';

export let planetas3D = [];
export let solMesh;
export let nubesNebulosa = [];
export let cinturonAsteroides; 
export let constelacionMesh;
export let fondoEstrellas;
export let estrellasRecuerdos = [];

let materialLineaGlobal;
let materialGlowGlobal;
let estrellasConstelacionObjetos = [];


export function crearSistemaSolar(scene) {
    const textureLoader = new THREE.TextureLoader();

    // ==========================================
    // 1. CREAR EL SOL CENTRAL (NOSOTROS)
    // ==========================================
    const solConfig = CONFIG_UNIVERSO.sol;
    const solGeometry = new THREE.SphereGeometry(solConfig.tamano, 32, 32);
    
    let solMaterial;
    try {
        const solTexture = textureLoader.load(solConfig.foto);
        solMaterial = new THREE.MeshBasicMaterial({ 
            map: solTexture,
            transparent: true 
        });
    } catch (error) {
        console.warn("No se pudo cargar la foto del sol, usando material básico.");
        solMaterial = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
    }

    solMesh = new THREE.Mesh(solGeometry, solMaterial);
    solMesh.userData = { 
        nombre: solConfig.nombre, 
        tipo: "sol", 
        contenido: solConfig.foto, 
        descripcion: solConfig.descripcion 
    };
    scene.add(solMesh);

    // --- LUZ DEL SOL ---
    const luzSol = new THREE.PointLight(0xffe9d1, 3.5, 150, 1);
    luzSol.position.set(0, 0, 0); 
    scene.add(luzSol);
    
    // --- RESPLANDOR (GLOW) DEL SOL ---
    const solGlowMaterial = new THREE.SpriteMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/lensflare/lensflare0.png'), 
        color: 0xffdb8a, 
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const solGlowSprite = new THREE.Sprite(solGlowMaterial);
    solGlowSprite.scale.set(12, 12, 1);
    scene.add(solGlowSprite);

    // ==========================================
    // 2. CREAR LOS PLANETAS Y SUS ÓRBITAS
    // ==========================================
    const planetaTexture = textureLoader.load('assets/fotos/textura-planeta-1.jpg');
    let maxDistanciaPlaneta = 0; 

    CONFIG_UNIVERSO.planetas.forEach((p) => {
        const planetaGeometry = new THREE.SphereGeometry(p.tamano, 32, 32);

        const planetaMaterial = new THREE.MeshStandardMaterial({
            map: planetaTexture,              
            roughness: 0.6,                   
            metalness: 0.1,                   
            color: p.color,                   
        });

        const planetaMesh = new THREE.Mesh(planetaGeometry, planetaMaterial);
        
        planetaMesh.userData = {
            id: p.id,
            nombre: p.nombre,
            tipo: p.tipo,
            contenido: p.contenido,
            textoFlotante: p.textoFlotante,
            distancia: p.distancia,
            velocidad: p.velocidad,
            angulo: Math.random() * Math.PI * 2, 
            pausado: false 
        };

        if (p.distancia > maxDistanciaPlaneta) {
            maxDistanciaPlaneta = p.distancia;
        }

        planetaMesh.position.x = Math.cos(planetaMesh.userData.angulo) * p.distancia;
        planetaMesh.position.z = Math.sin(planetaMesh.userData.angulo) * p.distancia;
        scene.add(planetaMesh);
        planetas3D.push(planetaMesh); 

        // --- Anillo de la Órbita ---
        const orbitaGeometry = new THREE.RingGeometry(p.distancia - 0.05, p.distancia + 0.05, 64);
        const orbitaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.08, 
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const orbitaMesh = new THREE.Mesh(orbitaGeometry, orbitaMaterial);
        orbitaMesh.rotation.x = Math.PI / 2; 
        scene.add(orbitaMesh);

        // --- ATMÓSFERA ---
        const atmospheresGeometry = new THREE.SphereGeometry(p.tamano * 1.15, 32, 32);
        const atmosferaMaterial = new THREE.MeshBasicMaterial({
            color: p.color,                  
            transparent: true,
            opacity: 0.22,                   
            blending: THREE.AdditiveBlending, 
            side: THREE.BackSide,             
            depthWrite: false                
        });

        const atmosferaMesh = new THREE.Mesh(atmospheresGeometry, atmosferaMaterial);
        atmosferaMesh.position.x = planetaMesh.position.x;
        atmosferaMesh.position.z = planetaMesh.position.z;
        scene.add(atmosferaMesh);
        planetaMesh.userData.atmosfera = atmosferaMesh;
    });
    
    // ==========================================
    // 3. CREAR POLVO CÓSMICO (NEBULOSA)
    // ==========================================
    const humoTexture = textureLoader.load('https://threejs.org/examples/textures/lensflare/lensflare0_alpha.png');
    const coloresNebulosa = [0x8b5cf6, 0xec4899, 0x3b82f6]; 
    
    for (let i = 0; i < 5; i++) {
        const nubeGeometry = new THREE.PlaneGeometry(60, 60);
        const nubeMaterial = new THREE.MeshBasicMaterial({
            map: humoTexture,
            color: coloresNebulosa[i % coloresNebulosa.length], 
            transparent: true,
            opacity: 0.12,                    
            blending: THREE.AdditiveBlending,  
            side: THREE.DoubleSide,
            depthWrite: false                  
        });
        
        const nubeMesh = new THREE.Mesh(nubeGeometry, nubeMaterial);
        nubeMesh.rotation.x = Math.PI / 2 + (Math.random() * 0.2 - 0.1);
        nubeMesh.rotation.z = Math.random() * Math.PI * 2;
        nubeMesh.position.set(
            Math.random() * 30 - 15,
            Math.random() * 2 - 1, 
            Math.random() * 30 - 15
        );
        nubeMesh.userData = { velocidadRotacion: (Math.random() * 0.001) + 0.0005 };
        scene.add(nubeMesh);
        nubesNebulosa.push(nubeMesh); 
    }

    // ==========================================
    // 4. CINTURÓN DE ASTEROIDES DINÁMICO
    // ==========================================
    const conteoAsteroides = 1200; 
    const asteroidesGeometry = new THREE.BufferGeometry();
    const posiciones = new Float32Array(conteoAsteroides * 3);
    const coloresAsteroides = new Float32Array(conteoAsteroides * 3); // Para dar variedad cromática a las rocas
    const datosOrbita = []; 

    const radioMin = maxDistanciaPlaneta + 4; 
    const radioMax = radioMin + 5; 

    // Paleta de colores para las rocas espaciales (grises, carbonaceos y tintes lila del espacio)
    const tonosRoca = [
        new THREE.Color(0xa3a3a3), // Gris mineral
        new THREE.Color(0x737373), // Roca oscura
        new THREE.Color(0xb5a4c4), // Reflejo lila cósmico
        new THREE.Color(0x525252)  // Carbonaceo profundo
    ];

    for (let i = 0; i < conteoAsteroides; i++) {
        const radio = radioMin + Math.random() * (radioMax - radioMin);
        const angulo = Math.random() * Math.PI * 2;
        const altura = (Math.random() - 0.5) * 1.2; // Un poco más de dispersión vertical

        const idx = i * 3;
        posiciones[idx]     = Math.cos(angulo) * radio; 
        posiciones[idx + 1] = altura;                   
        posiciones[idx + 2] = Math.sin(angulo) * radio; 

        // Asignar un tono de roca aleatorio para romper la monotonía
        const colorElegido = tonosRoca[Math.floor(Math.random() * tonosRoca.length)];
        // Añadimos una pequeña variación individual al brillo de cada una
        const variacionBrillo = 0.8 + Math.random() * 0.4; 
        coloresAsteroides[idx]     = colorElegido.r * variacionBrillo;
        coloresAsteroides[idx + 1] = colorElegido.g * variacionBrillo;
        coloresAsteroides[idx + 2] = colorElegido.b * variacionBrillo;

        datosOrbita.push({
            radio: radio,
            angulo: angulo,
            velocidad: (Math.random() * 0.0006) + 0.0003, // Rotación ligeramente más pausada y natural
            altura: altura
        });
    }

    asteroidesGeometry.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    asteroidesGeometry.setAttribute('color', new THREE.BufferAttribute(coloresAsteroides, 3));
    
    // --- NUEVO: Generar textura de micro-roca orgánica difuminada mediante Canvas ---
    const canvasAsteroide = document.createElement('canvas');
    canvasAsteroide.width = 16;
    canvasAsteroide.height = 16;
    const ctxAsteroide = canvasAsteroide.getContext('2d');

    // Creamos una máscara radial para eliminar las esquinas cuadradas
    const gradienteRoca = ctxAsteroide.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradienteRoca.addColorStop(0, 'rgba(255, 255, 255, 1.0)');   // Centro sólido
    gradienteRoca.addColorStop(0.3, 'rgba(230, 230, 230, 0.8)'); // Cuerpo de la roca
    gradienteRoca.addColorStop(0.7, 'rgba(150, 150, 150, 0.2)'); // Bordes suavizados y polvorientos
    gradienteRoca.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Transparencia total

    ctxAsteroide.fillStyle = gradienteRoca;
    ctxAsteroide.fillRect(0, 0, 16, 16);
    const texturaRocaEspacial = new THREE.CanvasTexture(canvasAsteroide);

    const asteroideMaterial = new THREE.PointsMaterial({
        size: 0.28, // Un poco más grandes para apreciar la forma esferoidal/polvorienta
        vertexColors: true, // Habilitar la paleta de colores que creamos arriba
        transparent: true,
        opacity: 0.65,
        map: texturaRocaEspacial, // Adiós cuadrados perfectos, hola partículas orgánicas
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true // Se encogen a la distancia, ganan volumen de cerca
    });

    cinturonAsteroides = new THREE.Points(asteroidesGeometry, asteroideMaterial);
    cinturonAsteroides.userData = { datosOrbita: datosOrbita };
    scene.add(cinturonAsteroides);
}

// ==========================================
// 5. FONDO DE ESTRELLAS REALISTA
// ==========================================
export function crearFondoEstrellas(scene) {
    const conteoEstrellas = 4000; 
    const geometria = new THREE.BufferGeometry();
    const posiciones = new Float32Array(conteoEstrellas * 3);
    const colores = new Float32Array(conteoEstrellas * 3);
    const fasesParpadeo = new Float32Array(conteoEstrellas);

    const paletaColores = [
        new THREE.Color(0xffffff), 
        new THREE.Color(0x3b82f6), 
        new THREE.Color(0xd946ef), 
        new THREE.Color(0xfbbf24), 
        new THREE.Color(0x06b6d4)  
    ];

    for (let i = 0; i < conteoEstrellas; i++) {
        const radio = 110 + Math.random() * 120;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        const idx = i * 3;
        posiciones[idx]     = radio * Math.sin(phi) * Math.cos(theta);
        posiciones[idx + 1] = radio * Math.sin(phi) * Math.sin(theta);
        posiciones[idx + 2] = radio * Math.cos(phi);

        const colorElegido = paletaColores[Math.floor(Math.random() * paletaColores.length)];
        
        colores[idx]     = colorElegido.r * 4.0;
        colores[idx + 1] = colorElegido.g * 4.0;
        colores[idx + 2] = colorElegido.b * 4.0;

        fasesParpadeo[i] = Math.random() * Math.PI * 2;
    }

    geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    geometria.setAttribute('color', new THREE.BufferAttribute(colores, 3));
    geometria.setAttribute('faseParpadeo', new THREE.BufferAttribute(fasesParpadeo, 1));

    const canvas = document.createElement('canvas');
    canvas.width = 32; 
    canvas.height = 32;
    const contexto = canvas.getContext('2d');

    const gradiente = contexto.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradiente.addColorStop(0, 'rgba(255, 255, 255, 1.0)');     
    gradiente.addColorStop(0.1, 'rgba(255, 255, 255, 0.9)');   
    gradiente.addColorStop(0.3, 'rgba(170, 200, 255, 0.6)');   
    gradiente.addColorStop(0.6, 'rgba(100, 130, 255, 0.2)');   
    gradiente.addColorStop(1, 'rgba(0, 0, 0, 0)');             

    contexto.fillStyle = gradiente;
    contexto.fillRect(0, 0, 32, 32);

    const texturaAutogenerada = new THREE.CanvasTexture(canvas);

    const materialEstrellas = new THREE.PointsMaterial({
        size: 4.5,                  
        vertexColors: true,
        transparent: true,
        opacity: 1.0,               
        map: texturaAutogenerada,   
        alphaTest: 0.001,            
        blending: THREE.AdditiveBlending, 
        sizeAttenuation: true,      
        depthWrite: false           
    });

    fondoEstrellas = new THREE.Points(geometria, materialEstrellas);
    fondoEstrellas.userData = { coloresOriginales: colores.slice() };
    
    scene.add(fondoEstrellas);
}

// ==========================================
// 6. CREAR CONSTELACIÓN PLANA CON TEXTURA RADIAL DE ALTO BRILLO
// ==========================================
export function crearConstelacionNombre(scene, nombre) {
    const contenedorConstelacion = new THREE.Group();
    estrellasConstelacionObjetos = []; // Limpiar caché de animación
    
    const letrasSegmentos = {
        'I': [[0, 3, 2, 3], [1, 3, 1, 0], [0, 0, 2, 0]],
        'S': [[2, 3, 0, 3], [0, 3, 0, 1.5], [0, 1.5, 2, 1.5], [2, 1.5, 2, 0], [2, 0, 0, 0]],
        'K': [[0, 3, 0, 0], [0, 1.5, 2, 3], [0, 1.5, 2, 0]],
        'E': [[0, 3, 2, 3], [0, 3, 0, 0], [0, 0, 2, 0], [0, 1.5, 1.5, 1.5]],
        'L': [[0, 3, 0, 0], [0, 0, 2, 0]]
    };

    const corazonSegmentos = [
        [2, 1.5, 1, 3], [1, 3, 0, 2.2], [0, 2.2, 0, 1], [0, 1, 2, -1.5],
        [2, -1.5, 4, 1], [4, 1, 4, 2.2], [4, 2.2, 3, 3], [3, 3, 2, 1.5]
    ];

    const escala = 2.2;    
    const espaciadoLetra = 3.5; 
    let offsetOffsetX = -(2 * espaciadoLetra) - 1; 

    // Líneas guías astronómicas sutiles
    materialLineaGlobal = new THREE.LineBasicMaterial({
        color: 0xd946ef, 
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

    materialGlowGlobal = new THREE.LineBasicMaterial({
        color: 0xa855f7, 
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    // --- GENERAR TEXTURA CANVAS DE ESTRELLA REAL CON DESTELLO RADIAL ---
    const canvasEstrella = document.createElement('canvas');
    canvasEstrella.width = 64;
    canvasEstrella.height = 64;
    const ctx = canvasEstrella.getContext('2d');
    
    const gradienteEstrella = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradienteEstrella.addColorStop(0, 'rgba(255, 255, 255, 1.0)');     // Núcleo puro
    gradienteEstrella.addColorStop(0.15, 'rgba(245, 243, 255, 0.9)'); // Halo interno blanco-lila
    gradienteEstrella.addColorStop(0.4, 'rgba(217, 70, 239, 0.4)');   // Brillo magenta exterior
    gradienteEstrella.addColorStop(0.7, 'rgba(168, 85, 247, 0.08)');  // Corona difuminada
    gradienteEstrella.addColorStop(1, 'rgba(0, 0, 0, 0)');            // Transparencia total
    
    ctx.fillStyle = gradienteEstrella;
    ctx.fillRect(0, 0, 64, 64);
    const texturaEstrellaReal = new THREE.CanvasTexture(canvasEstrella);

    // Guardaremos los puntos del mapa para pintarlos planos (z = 0)
    const mapaNodosUnicos = new Map();

    const registrarNodo = (x, y, esCorazon = false) => {
        const clave = `${x.toFixed(2)}_${y.toFixed(2)}`;
        if (!mapaNodosUnicos.has(clave)) {
            mapaNodosUnicos.set(clave, {
                posicion: new THREE.Vector3(x, y, 0),
                fase: Math.random() * Math.PI * 2,
                esCorazon: esCorazon,
                size: esCorazon ? (0.9 + Math.random() * 0.4) : (0.75 + Math.random() * 0.4) // Magnitud visual variable
            });
        }
        return mapaNodosUnicos.get(clave).posicion;
    };

    // Procesar letras
    const nombreUpper = nombre.toUpperCase();
    for (let i = 0; i < nombreUpper.length; i++) {
        const letra = nombreUpper[i];
        if (letra === ' ') { offsetOffsetX += 2.5; continue; }

        const segmentos = letrasSegmentos[letra];
        if (!segmentos) { offsetOffsetX += 2.5; continue; }

        const puntosLineas = [];

        segmentos.forEach(([x1, y1, x2, y2]) => {
            const posX1 = (x1 + offsetOffsetX) * escala;
            const posY1 = y1 * escala;
            const posX2 = (x2 + offsetOffsetX) * escala;
            const posY2 = y2 * escala;

            const p1 = registrarNodo(posX1, posY1, false);
            const p2 = registrarNodo(posX2, posY2, false);
            puntosLineas.push(p1, p2);
        });

        const geometriaSegmentos = new THREE.BufferGeometry().setFromPoints(puntosLineas);
        const lineaPrincipal = new THREE.LineSegments(geometriaSegmentos, materialLineaGlobal);
        const lineaGlow = new THREE.LineSegments(geometriaSegmentos, materialGlowGlobal);

        contenedorConstelacion.add(lineaGlow, lineaPrincipal);
        offsetOffsetX += espaciadoLetra; 
    }

    // Procesar Corazón
    const puntosCorazon = [];
    const escalaCorazon = 1.8; 

    corazonSegmentos.forEach(([x1, y1, x2, y2]) => {
        const posX1 = (x1 - 2) * escalaCorazon;
        const posY1 = (y1 * escalaCorazon) - 6; 
        const posX2 = (x2 - 2) * escalaCorazon;
        const posY2 = (y2 * escalaCorazon) - 6;

        const p1 = registrarNodo(posX1, posY1, true);
        const p2 = registrarNodo(posX2, posY2, true);
        puntosCorazon.push(p1, p2);
    });

    const geometriaCorazon = new THREE.BufferGeometry().setFromPoints(puntosCorazon);
    const corazonPrincipal = new THREE.LineSegments(geometriaCorazon, materialLineaGlobal);
    const corazonGlow = new THREE.LineSegments(geometriaCorazon, materialGlowGlobal);

    contenedorConstelacion.add(corazonGlow, corazonPrincipal);

    // --- CREAR CADA ESTRELLA COMO UN APARTADO INDEPENDIENTE CON TEXTURA DESTELANTE ---
    mapaNodosUnicos.forEach((nodo) => {
        const estrellaGeom = new THREE.BufferGeometry();
        const vertices = new Float32Array([nodo.posicion.x, nodo.posicion.y, nodo.posicion.z]);
        estrellaGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const estrellaMat = new THREE.PointsMaterial({
            size: nodo.size,
            map: texturaEstrellaReal,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const puntoEstrella = new THREE.Points(estrellaGeom, estrellaMat);
        
        // Guardamos metadatos para la animación de titileo en las propiedades personalizadas
        puntoEstrella.userData = {
            fase: nodo.fase,
            sizeBase: nodo.size
        };

        contenedorConstelacion.add(puntoEstrella);
        estrellasConstelacionObjetos.push(puntoEstrella);
    });

    // Colocación fija perfectamente plana en el fondo celeste
    contenedorConstelacion.position.set(0, 21, -32);
    contenedorConstelacion.rotation.x = Math.PI / 4.5; 

    constelacionMesh = contenedorConstelacion;
    scene.add(constelacionMesh);
}

// ==========================================
// 7. BUCLE DE ACTUALIZACIÓN DE MOVIMIENTOS
// ==========================================
export function actualizarOrbitas() {
    if (solMesh) {
        solMesh.rotation.y += 0.002;
    }

    planetas3D.forEach((planeta) => {
        if (!planeta.userData.pausado) {
            planeta.userData.angulo += planeta.userData.velocidad;
            
            const nuevaX = Math.cos(planeta.userData.angulo) * planeta.userData.distancia;
            const nuevaZ = Math.sin(planeta.userData.angulo) * planeta.userData.distancia;
            
            planeta.position.x = nuevaX;
            planeta.position.z = nuevaZ;
            planeta.rotation.y += 0.01;

            if (planeta.userData.atmosfera) {
                planeta.userData.atmosfera.position.x = nuevaX;
                planeta.userData.atmosfera.position.z = nuevaZ;
            }
        }
    });

    // --- ANIMACIÓN ORGÁNICA DE BRILLO EN LAS TEXTURAS DE LAS ESTRELLAS ---
    if (constelacionMesh && estrellasConstelacionObjetos.length > 0) {
        const tiempo = Date.now() * 0.0025; 
        
        estrellasConstelacionObjetos.forEach((estrella) => {
            const udf = estrella.userData.fase;
            const tamañoOriginal = estrella.userData.sizeBase;

            // Hace cambiar sutilmente el tamaño del destello simulando el parpadeo del aire espacial
            const factorEscala = (Math.sin(tiempo + udf) * 0.25) + 0.95;
            estrella.material.size = tamañoOriginal * factorEscala;
            
            // También modificamos la opacidad levemente para máximo realismo
            estrella.material.opacity = (Math.sin(tiempo + udf) * 0.2) + 0.8;
        });
    }

    nubesNebulosa.forEach((nube) => {
        nube.rotation.z += nube.userData.velocidadRotacion;
    });

    if (cinturonAsteroides) {
        const datos = cinturonAsteroides.userData.datosOrbita;
        const posiciones = cinturonAsteroides.geometry.attributes.position.array;

        for (let i = 0; i < datos.length; i++) {
            datos[i].angulo += datos[i].velocidad; 

            const idx = i * 3;
            posiciones[idx]     = Math.cos(datos[i].angulo) * datos[i].radio;
            posiciones[idx + 2] = Math.sin(datos[i].angulo) * datos[i].radio;
        }
        cinturonAsteroides.geometry.attributes.position.needsUpdate = true;
    }

    if (fondoEstrellas) {
        fondoEstrellas.rotation.y += 0.00008; 

        const atributos = fondoEstrellas.geometry.attributes;
        const arrayColores = atributos.color.array;
        const arrayFases = atributos.faseParpadeo.array;
        const coloresOriginales = fondoEstrellas.userData.coloresOriginales;
        
        const tiempoActual = Date.now() * 0.002; 

        for (let i = 0; i < arrayFases.length; i++) {
            const factorTitileo = Math.sin(tiempoActual + arrayFases[i]);
            const boostBrillo = (factorTitileo * 1.1) + 1.4; 

            const idx = i * 3;
            arrayColores[idx]     = coloresOriginales[idx] * boostBrillo;
            arrayColores[idx + 1] = coloresOriginales[idx + 1] * boostBrillo;
            arrayColores[idx + 2] = coloresOriginales[idx + 2] * boostBrillo;
        }

        atributos.color.needsUpdate = true;
    }
}

// ==========================================
// 8. CREAR ESTRELLAS DE RECUERDOS (ESTILIZADAS Y BRILLANTES)
// ==========================================
export function crearEstrellasRecuerdos(scene) {
    const textureLoader = new THREE.TextureLoader();
    
    // --- NUEVO: Generar textura canvas de ESTRELLA DE DESTELLO CÓSMICO (Cruz de 4 puntas) ---
    const canvasEstrella = document.createElement('canvas');
    canvasEstrella.width = 128; // Más resolución para que el destello se vea nítido
    canvasEstrella.height = 128;
    const ctx = canvasEstrella.getContext('2d');
    
    const centroX = 64;
    const centroY = 64;

    // 1. Crear un resplandor radial suave de fondo (Halo mágico)
    const gradienteHalo = ctx.createRadialGradient(centroX, centroY, 0, centroX, centroY, 50);
    gradienteHalo.addColorStop(0, 'rgba(255, 220, 255, 0.6)');  // Centro lila/blanco brillante
    gradienteHalo.addColorStop(0.3, 'rgba(236, 72, 153, 0.2)'); // Halo magenta intermedio
    gradienteHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Difuminado total
    ctx.fillStyle = gradienteHalo;
    ctx.beginPath();
    ctx.arc(centroX, centroY, 50, 0, Math.PI * 2);
    ctx.fill();

    // 2. Dibujar el destello vertical y horizontal (Efecto lente astronómico / Cruz de 4 puntas)
    // Línea horizontal del destello
    const gradH = ctx.createLinearGradient(14, centroY, 114, centroY);
    gradH.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradH.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)'); // Núcleo blanco puro super brillante
    gradH.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradH;
    ctx.fillRect(14, centroY - 2, 100, 4); // Destello horizontal delgado

    // Línea vertical del destello
    const gradV = ctx.createLinearGradient(centroX, 14, centroX, 114);
    gradV.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradV.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)'); // Núcleo blanco puro
    gradV.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradV;
    ctx.fillRect(centroX - 2, 14, 4, 100); // Destello vertical delgado

    // 3. Mini núcleo central intenso
    const gradCentro = ctx.createRadialGradient(centroX, centroY, 0, centroX, centroY, 6);
    gradCentro.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradCentro.addColorStop(1, 'rgba(255, 230, 100, 0.8)'); // Borde dorado/cálido en el corazón de la estrella
    ctx.fillStyle = gradCentro;
    ctx.beginPath();
    ctx.arc(centroX, centroY, 6, 0, Math.PI * 2);
    ctx.fill();

    const texturaEstrellaRecuerdo = new THREE.CanvasTexture(canvasEstrella);

    // Iterar sobre los recuerdos en CONFIG_UNIVERSO
    CONFIG_UNIVERSO.recuerdos.forEach((recuerdo, index) => {
        const estrellaGeom = new THREE.BufferGeometry();
        const vertices = new Float32Array([0, 0, 0]); 
        estrellaGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const estrellaMat = new THREE.PointsMaterial({
            size: 7.5, // <-- SIGNIFICATIVAMENTE MÁS GRANDES (Antes era 1.5) para que destaquen a primera vista
            map: texturaEstrellaRecuerdo, // Nuestra nueva textura personalizada en forma de cruz mágica
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending, // Hace que los colores se sumen y brillen con luz propia
            depthWrite: false,
            sizeAttenuation: true // Se ven gigantes si te acercas con la cámara, manteniendo el efecto 3D
        });

        const puntoEstrella = new THREE.Points(estrellaGeom, estrellaMat);
        
        // --- POSICIONAMIENTO EN ESPACIO PROFUNDO ---
        const radioRecuerdos = 45 + (index * 3); // Distribución radial
        const anguloBase = (index / CONFIG_UNIVERSO.recuerdos.length) * Math.PI * 2;
        const anguloAleatorio = (Math.random() - 0.5) * 0.4;
        const alturaAleatoria = (Math.random() - 0.5) * 22; // Dispersión en el eje Y

        const x = Math.cos(anguloBase + anguloAleatorio) * radioRecuerdos;
        const z = Math.sin(anguloBase + anguloAleatorio) * radioRecuerdos;
        const y = alturaAleatoria;

        puntoEstrella.position.set(x, y, z);
        
        // Guardar datos del recuerdo para la física de clics
        puntoEstrella.userData = {
            id: `recuerdo_${index}`,
            nombre: recuerdo.titulo,
            tipo: recuerdo.tipo,
            contenido: recuerdo.contenido, 
            descripcion: recuerdo.descripcion,
            fase: Math.random() * Math.PI * 2, 
            pausado: false
        };

        scene.add(puntoEstrella);
        estrellasRecuerdos.push(puntoEstrella); 
    });
}