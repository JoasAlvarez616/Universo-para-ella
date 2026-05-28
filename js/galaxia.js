// js/galaxia.js - VERSIÓN TEXTURA RADIAL BRILLANTE Y TITILEO ORGÁNICO (CON ULTRA-GLOW CORREGIDO)
import * as THREE from 'three';
import { CONFIG_UNIVERSO } from './recuerdos.js';

export let planetas3D = [];
export let solMesh;
export let nubesNebulosa = [];
export let cinturonAsteroides; 
export let constelacionMesh;
export let fondoEstrellas;
export let estrellasRecuerdos = [];

let materialLineGlobal;
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

    const luzSol = new THREE.PointLight(0xffe9d1, 3.5, 200, 0.5); // Aumentado el alcance de la luz
    luzSol.position.set(0, 0, 0); 
    scene.add(luzSol);
    
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
    let maxDistanciaPlaneta = 0; 

    CONFIG_UNIVERSO.planetas.forEach((p) => {
        const planetaGeometry = new THREE.SphereGeometry(p.tamano, 32, 32);
        const texturaIndividual = p.textura ? textureLoader.load(p.textura) : null;

       // Usamos una autoiluminación suave para que el planeta no quede a oscuras en el fondo,
        // pero lo suficientemente baja para que la textura se aprecie con total nitidez.
        // ==========================================================================
        const planetaMaterial = new THREE.MeshStandardMaterial({
            map: texturaIndividual,            
            roughness: p.tipo === 'video' ? 0.2 : 0.45, 
            metalness: p.tipo === 'texto' ? 0.2 : 0.05, 
            color: texturaIndividual ? 0xffffff : p.color, // TIP PRO: Si hay textura, el color base debe ser blanco para no tintar la foto

            // Autoiluminación ambiental sutil para evitar el negro absoluto OLED
            emissive: texturaIndividual ? 0x222222 : p.color, 
            emissiveIntensity: texturaIndividual ? 1.0 : 0.4 
        });

        const planetaMesh = new THREE.Mesh(planetaGeometry, planetaMaterial);
        
        planetaMesh.userData = {
            id: p.id,
            nombre: p.nombre,
            tipo: p.tipo,
            contenido: p.contenido,
            descripcion: p.descripcion || "",
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

        // ==========================================================================
        // ✔️ ÓRBITAS COMPENSADAS: Aumentamos la opacidad base a 0.28 para pantallas móviles
        // ==========================================================================
        const orbitaGeometry = new THREE.RingGeometry(p.distancia - 0.07, p.distancia + 0.07, 64);
        const orbitaMaterial = new THREE.MeshBasicMaterial({
            color: p.color, 
            opacity: 0.28, // Órbita visible, nítida y con presencia elegante
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
            opacity: 0.28, // Sutil aumento de la atmósfera base                  
            blending: THREE.AdditiveBlending, 
            side: THREE.BackSide,             
            depthWrite: false                
        });

        const atmosferaMesh = new THREE.Mesh(atmospheresGeometry, atmosferaMaterial);
        atmosferaMesh.position.x = planetaMesh.position.x;
        atmosferaMesh.position.z = planetaMesh.position.z;
        scene.add(atmosferaMesh);
        planetaMesh.userData.atmosfera = atmosferaMesh;

        // --- SISTEMA DE PARTÍCULAS (ANILLO) PLANETA 4 ---
        if (p.id === 4) {
            const numeroAsteroides = 1500; 
            const anilloGeometry = new THREE.BufferGeometry();
            const posiciones = new Float32Array(numeroAsteroides * 3);

            const radioInterno = p.tamano * 1.4; 
            const radioExterno = p.tamano * 2.3; 

            for (let i = 0; i < numeroAsteroides; i++) {
                const anguloParticula = Math.random() * Math.PI * 2;
                const distanciaParticula = radioInterno + Math.random() * (radioExterno - radioInterno);

                posiciones[i * 3] = Math.cos(anguloParticula) * distanciaParticula; 
                posiciones[i * 3 + 1] = (Math.random() - 0.5) * 0.12;              
                posiciones[i * 3 + 2] = Math.sin(anguloParticula) * distanciaParticula; 
            }

            anilloGeometry.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));

            const anilloMaterial = new THREE.PointsMaterial({
                color: p.color,
                size: 0.05, 
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending, 
                depthWrite: false
            });

            const anilloParticulas = new THREE.Points(anilloGeometry, anilloMaterial);
            scene.add(anilloParticulas);
            planetaMesh.userData.anilloGemas = anilloParticulas;
        }
    });

    // ==========================================
    // 3. CREAR POLVO CÓSMICO (NEBULOSA)
    // ==========================================
    const humoTexture = textureLoader.load('https://threejs.org/examples/textures/lensflare/lensflare0_alpha.png');
    const coloresNebulosa = [0x8b5cf6, 0xec4899, 0x3b82f6]; 
    
    for (let i = 0; i < 5; i++) {
        const nubeGeometry = new THREE.PlaneGeometry(70, 70);
        const nubeMaterial = new THREE.MeshBasicMaterial({
            map: humoTexture,
            color: coloresNebulosa[i % coloresNebulosa.length], 
            transparent: true,
            opacity: 0.10,                    
            blending: THREE.AdditiveBlending,  
            side: THREE.DoubleSide,
            depthWrite: false                  
        });
        
        const nubeMesh = new THREE.Mesh(nubeGeometry, nubeMaterial);
        nubeMesh.rotation.x = Math.PI / 2 + (Math.random() * 0.2 - 0.1);
        nubeMesh.rotation.z = Math.random() * Math.PI * 2;
        nubeMesh.position.set(
            Math.random() * 40 - 20,
            Math.random() * 2 - 1, 
            Math.random() * 40 - 20
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
    const coloresAsteroides = new Float32Array(conteoAsteroides * 3); 
    const datosOrbita = []; 

    const radioMin = maxDistanciaPlaneta + 5; // Re-adaptado automáticamente a la nueva distancia del universo
    const radioMax = radioMin + 6; 

    const tonosRoca = [
        new THREE.Color(0xa3a3a3), 
        new THREE.Color(0x737373), 
        new THREE.Color(0xb5a4c4), 
        new THREE.Color(0x525252)  
    ];

    for (let i = 0; i < conteoAsteroides; i++) {
        const radio = radioMin + Math.random() * (radioMax - radioMin);
        const angulo = Math.random() * Math.PI * 2;
        const altura = (Math.random() - 0.5) * 1.2; 

        const idx = i * 3;
        posiciones[idx]     = Math.cos(angulo) * radio; 
        posiciones[idx + 1] = altura;                   
        posiciones[idx + 2] = Math.sin(angulo) * radio; 

        const colorElegido = tonosRoca[Math.floor(Math.random() * tonosRoca.length)];
        const variacionBrillo = 0.8 + Math.random() * 0.4; 
        coloresAsteroides[idx]     = colorElegido.r * variacionBrillo;
        coloresAsteroides[idx + 1] = colorElegido.g * variacionBrillo;
        coloresAsteroides[idx + 2] = colorElegido.b * variacionBrillo;

        datosOrbita.push({
            radio: radio,
            angulo: angulo,
            velocidad: (Math.random() * 0.0006) + 0.0003, 
            altura: altura
        });
    }

    asteroidesGeometry.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    asteroidesGeometry.setAttribute('color', new THREE.BufferAttribute(coloresAsteroides, 3));
    
    const canvasAsteroide = document.createElement('canvas');
    canvasAsteroide.width = 16;
    canvasAsteroide.height = 16;
    const ctxAsteroide = canvasAsteroide.getContext('2d');

    const gradienteRoca = ctxAsteroide.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradienteRoca.addColorStop(0, 'rgba(255, 255, 255, 1.0)');   
    gradienteRoca.addColorStop(0.3, 'rgba(230, 230, 230, 0.8)'); 
    gradienteRoca.addColorStop(0.7, 'rgba(150, 150, 150, 0.2)'); 
    gradienteRoca.addColorStop(1, 'rgba(0, 0, 0, 0)');           

    ctxAsteroide.fillStyle = gradienteRoca;
    ctxAsteroide.fillRect(0, 0, 16, 16);
    const texturaRocaEspacial = new THREE.CanvasTexture(canvasAsteroide);

    const asteroideMaterial = new THREE.PointsMaterial({
        size: 0.32, 
        vertexColors: true, 
        transparent: true,
        opacity: 0.75,
        map: texturaRocaEspacial, 
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true 
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
        const radio = 130 + Math.random() * 120; // Empujadas un poco más lejos para dar espacio al mapa expandido
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
        size: 4.8,                  
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
    scene.add(fondoEstrellas);
}

// ==========================================
// 6. CREAR CONSTELACIÓN NOMBRE
// ==========================================
export function crearConstelacionNombre(scene, nombre) {
    const contenedorConstelacion = new THREE.Group();
    estrellasConstelacionObjetos = []; 
    
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

    const materialLineGlobal = new THREE.LineBasicMaterial({
        color: 0xffffff, 
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const materialGlowIntenso = new THREE.LineBasicMaterial({
        color: 0xa855f7, 
        transparent: true,
        opacity: 1.8,
        blending: THREE.AdditiveBlending
    });

    const materialGlowAmbiente = new THREE.LineBasicMaterial({
        color: 0x6366f1, 
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const corazonGlowCeleste = new THREE.LineBasicMaterial({
        color: 0x06b6d4, 
        transparent: true,
        opacity: 0.95,    
        blending: THREE.AdditiveBlending
    });

    const corazonGlowProfundo = new THREE.LineBasicMaterial({
        color: 0x3b82f6, 
        transparent: true,
        opacity: 0.70,
        blending: THREE.AdditiveBlending
    });

    const canvasEstrella = document.createElement('canvas');
    canvasEstrella.width = 64;
    canvasEstrella.height = 64;
    const ctx = canvasEstrella.getContext('2d');
    
    const gradienteEstrella = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradienteEstrella.addColorStop(0, 'rgba(255, 255, 255, 1.0)');       
    gradienteEstrella.addColorStop(0.2, 'rgba(6, 182, 212, 0.95)');      
    gradienteEstrella.addColorStop(0.5, 'rgba(116, 14, 212, 0.6)');      
    gradienteEstrella.addColorStop(0.8, 'rgba(99, 102, 241, 0.15)');     
    gradienteEstrella.addColorStop(1, 'rgba(0, 0, 0, 0)');            
    
    ctx.fillStyle = gradienteEstrella;
    ctx.fillRect(0, 0, 64, 64);
    const texturaEstrellaReal = new THREE.CanvasTexture(canvasEstrella);

    const mapaNodosUnicos = new Map();

    const registrarNodo = (x, y, esCorazon = false) => {
        const clave = `${x.toFixed(2)}_${y.toFixed(2)}`;
        if (!mapaNodosUnicos.has(clave)) {
            mapaNodosUnicos.set(clave, {
                posicion: new THREE.Vector3(x, y, 0),
                fase: Math.random() * Math.PI * 2,
                esCorazon: esCorazon,
                size: esCorazon ? (2.8 + Math.random() * 1.0) : (2.0 + Math.random() * 0.8)
            });
        }
        return mapaNodosUnicos.get(clave).posicion;
    };

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

        const geometrySegmentos = new THREE.BufferGeometry().setFromPoints(puntosLineas);
        
        const lineaPrincipal = new THREE.LineSegments(geometrySegmentos, materialLineGlobal);
        const lineaGlow1 = new THREE.LineSegments(geometrySegmentos, materialGlowIntenso);
        const lineaGlow2 = new THREE.LineSegments(geometrySegmentos, materialGlowAmbiente);

        contenedorConstelacion.add(lineaGlow2, lineaGlow1, lineaPrincipal);
        offsetOffsetX += espaciadoLetra; 
    }

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

    const geometryCorazon = new THREE.BufferGeometry().setFromPoints(puntosCorazon);
    
    const corazonPrincipal = new THREE.LineSegments(geometryCorazon, materialLineGlobal);
    const corazonGlow1 = new THREE.LineSegments(geometryCorazon, corazonGlowCeleste);
    const corazonGlow2 = new THREE.LineSegments(geometryCorazon, corazonGlowProfundo);

    contenedorConstelacion.add(corazonGlow2, corazonGlow1, corazonPrincipal);

    mapaNodosUnicos.forEach((nodo) => {
        const estrellaGeom = new THREE.BufferGeometry();
        const vertices = new Float32Array([nodo.posicion.x, nodo.posicion.y, nodo.posicion.z]);
        estrellaGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const estrellaMat = new THREE.PointsMaterial({
            size: nodo.size,
            map: texturaEstrellaReal,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const puntoEstrella = new THREE.Points(estrellaGeom, estrellaMat);
        
        puntoEstrella.userData = {
            fase: nodo.fase,
            sizeBase: nodo.size,
            esCorazon: nodo.esCorazon
        };

        contenedorConstelacion.add(puntoEstrella);
        estrellasConstelacionObjetos.push(puntoEstrella);
    });

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
                planeta.userData.atmosfera.position.copy(planeta.position);
            }

            if (planeta.userData.anilloGemas) {
                planeta.userData.anilloGemas.position.copy(planeta.position);
                planeta.userData.anilloGemas.rotation.y += 0.002; 
            }
        }
    });
}

// ==========================================
// 8. CREAR ESTRELLAS DE RECUERDOS
// ==========================================
export function crearEstrellasRecuerdos(scene) {
    const textureLoader = new THREE.TextureLoader();
    
    const canvasEstrella = document.createElement('canvas');
    canvasEstrella.width = 128; 
    canvasEstrella.height = 128;
    const ctx = canvasEstrella.getContext('2d');
    
    const centroX = 64;
    const centroY = 64;

    const gradienteHalo = ctx.createRadialGradient(centroX, centroY, 0, centroX, centroY, 50);
    gradienteHalo.addColorStop(0, 'rgba(255, 220, 255, 0.6)');  
    gradienteHalo.addColorStop(0.3, 'rgba(236, 72, 153, 0.2)'); 
    gradienteHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');           
    ctx.fillStyle = gradienteHalo;
    ctx.beginPath();
    ctx.arc(centroX, centroY, 50, 0, Math.PI * 2);
    ctx.fill();

    const gradH = ctx.createLinearGradient(14, centroY, 114, centroY);
    gradH.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradH.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)'); 
    gradH.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradH;
    ctx.fillRect(14, centroY - 2, 100, 4); 

    const gradV = ctx.createLinearGradient(centroX, 14, centroX, 114);
    gradV.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradV.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)'); 
    gradV.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradV;
    ctx.fillRect(centroX - 2, 14, 4, 100); 

    const gradCentro = ctx.createRadialGradient(centroX, centroY, 0, centroX, centroY, 6);
    gradCentro.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradCentro.addColorStop(1, 'rgba(255, 230, 100, 0.8)'); 
    ctx.fillStyle = gradCentro;
    ctx.beginPath();
    ctx.arc(centroX, centroY, 6, 0, Math.PI * 2);
    ctx.fill();

    const texturaEstrellaRecuerdo = new THREE.CanvasTexture(canvasEstrella);

    CONFIG_UNIVERSO.recuerdos.forEach((recuerdo, index) => {
        const estrellaGeom = new THREE.BufferGeometry();
        const vertices = new Float32Array([0, 0, 0]); 
        estrellaGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const estrellaMat = new THREE.PointsMaterial({
            size: 8.5, // Ligeramente optimizado el tamaño para alta densidad
            map: texturaEstrellaRecuerdo, 
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending, 
            depthWrite: false,
            sizeAttenuation: true 
        });

        const puntoEstrella = new THREE.Points(estrellaGeom, estrellaMat);
        
        const radioRecuerdos = 45 + (index * 3); 
        const anguloBase = (index / CONFIG_UNIVERSO.recuerdos.length) * Math.PI * 2;
        const anguloAleatorio = (Math.random() - 0.5) * 0.4;
        const alturaAleatoria = (Math.random() - 0.5) * 22; 

        const x = Math.cos(anguloBase + anguloAleatorio) * radioRecuerdos;
        const z = Math.sin(anguloBase + anguloAleatorio) * radioRecuerdos;
        const y = alturaAleatoria;

        puntoEstrella.position.set(x, y, z);
        
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