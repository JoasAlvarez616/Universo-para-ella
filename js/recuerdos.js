// js/recuerdos.js

export const CONFIG_UNIVERSO = {
    // Configuración general del Sol Central (Ustedes)
    sol: {
        nombre: "Nosotros",
        foto: "assets/fotos/Picsart_26-05-26_19-18-55-452.jpg", 
        tamano: 4,                        
        descripcion: "El centro de mi universo. Donde todo comenzó y hacia donde todo gravita."
    },

    // 🪐 LISTA DE PLANETAS REORDENADA CON JERARQUÍA CÓSMICA REAL
    // Mantiene tus ID, contenidos de fotos y descripciones intactas, pero calibra tamaños y distancias.
    planetas: [
        {
            id: 1, // ☄️ ESTRELA BASE: MERCURIO
            nombre: "El Inicio",
            tipo: "texto",
            contenido: `Ni siquiera sé que decir o el cómo decirlo...
    Sabes? Eres una gran parte de mi vida y mi corazón, 
    llegaste para quedarte y amo demasiado que en esta
    vida, con tanta oscuridad, llegarás cómo un lucero,
    para llenar mis días con tú alegría y esa sonrisa
    que sana el alma. 
    Todo esto es por tí, porque te amo y quiero expresarte mi amor.

    ATT: El niño que te ama`,
            textura: "assets/fotos/textura-planeta-1.jpg",
            color: 0x8b5cf6, 
            tamano: 1.1,       // Pequeño y veloz, el más cercano al Sol
            distancia: 12,   
            velocidad: 0.022 
        },
        {
            id: 2, // 🌌 ESTRELA BASE: VENUS
            nombre: "Nuestras Fotos Favoritas",
            tipo: "foto",
            contenido: "assets/fotos/Picsart_26-05-27_15-37-14-054.jpg", 
            descripcion: "Días especiales, recuerdos llenos de felicidad", 
            textura: "assets/fotos/textura-planeta-2.jpg", 
            color: 0x3b82f6, 
            tamano: 1.8,       // Gemelo en escala media
            distancia: 20,   
            velocidad: 0.016  
        },
        {
            id: 3, // 🌍 ESTRELA BASE: TIERRA
            nombre: "Te has convertido en mi hogar, dulce hogar",
            tipo: "video",
            contenido: "assets/fotos/VID_45450913_045128_765.mp4", 
            descripcion: "Un recuerdo en movimiento de esos besos que tanto extraño. Mi hogar", 
            textura: "assets/fotos/8.jpg", 
            color: 0x2b82c9,   // Tono azul/celeste más terrestre
            tamano: 2.0,       // Tamaño balanceado de soporte de vida
            distancia: 28,
            velocidad: 0.012
        },
        {
            id: 4, // 🔴 ESTRELA BASE: MARTE
            nombre: "El Horizonte Compartido",
            tipo: "foto",
            contenido: "assets/fotos/Picsart_26-05-28_00-24-43-602.jpg", 
            descripcion: `Permanecerá la promesa de siempre estar y amarte aún en
            los días dificiles y seguir construyendo nuestro universo juntos.`, 
            textura: "assets/fotos/textura-planeta-3.jpg", 
            color: 0xf59e0b, 
            tamano: 1.4,       // Más pequeño que la tierra, desértico y místico
            distancia: 38,        
            velocidad: 0.009      
        },
        {
            id: 5, // 🟤 ESTRELA BASE: JÚPITER
            nombre: "El Infinito de tus Ojos",
            tipo: "foto",
            contenido: "assets/fotos/IMG-20260423-WA0206.jpg",
            descripcion: `Tú mirada que me llena, que me da felicidad
             esa mirada que me recuerda porque sigo avanzando, esa mirada que me hace sentir
             que todo va a estar bien.`, 
            textura: "assets/fotos/textura-planeta-4.jpg", 
            color: 0x06b6d4,      
            tamano: 4.8,       // ¡EL GIGANTE GASEOSO! El planeta más imponente y masivo
            distancia: 56,        
            velocidad: 0.004      
        },
        {
            id: 6, // 🪐 ESTRELA BASE: SATURNO
            nombre: "Los sueños de mi niña no tienen limite",
            tipo: "foto",
            contenido: "assets/fotos/PXL_20260117_093840648.jpg", 
            descripcion: `Así cómo las montañas, crecerán los sueños de mi niña,
                        así cómo el universo, no tendrán límite`,
            textura: "assets/fotos/textura-planeta-5.jpg", 
            color: 0xec4899,       
            tamano: 3.8,       // Grande, majestuoso y estilizado
            distancia: 78,        
            velocidad: 0.002,     
            tieneAnillo: true  // 🌟 ¡ENCIENDE EL CINTURÓN DE METEORITOS EN EL PLANETA 6!
        },
        {
            id: 7, // 🔷 ESTRELA BASE: URANO
            nombre: "Y así, siempre mi paz en medio del ruido",
            tipo: "video",
            contenido: "assets/fotos/Snapchat-896450706.mp4", 
            descripcion: "Mi corazón encuentra calma al conectar con el tuyo",
            textura: "assets/fotos/textura-planeta-6.jpg", 
            color: 0x4b70dd,       // Azul helado profundo
            tamano: 2.6,          
            distancia: 96,        
            velocidad: 0.0009     
        },
        {
            id: 8, // 🔮 ESTRELA BASE: NEPTUNO
            nombre: "El Destino Final",
            tipo: "texto",
            contenido: `No importa el tiempo, la distancia, ni los obstáculos que el universo nos ponga, 
            siempre encontraré la forma de llegar a ti. Eres mi destino final, mi amor eterno.`,
            descripcion: "Nuestro espacio eterno",
            textura: "assets/fotos/textura-planeta-7.jpg", 
            color: 0xa855f7,       
            tamano: 2.4,          
            distancia: 114,       // El guardián en los bordes helados de la galaxia
            velocidad: 0.0004     // Movimiento lento, imponente e infinito
        }
    ],

    // ✨ LISTA DE RECUERDOS (Las estrellas clicables fijas en el espacio profundo)
    // El sistema del archivo galaxia.js que armamos las distribuirá automáticamente afuera del cinturón
    recuerdos: [
        {
            titulo: "Nunca faltan las risas",
            tipo: "video", // Mini video en una estrella profunda
            contenido: "assets/fotos/VID-20250607-WA0097(1).mp4",
            descripcion: "Amo verte sonreír"
        },
        {
            titulo: "En el pueblo que amo, con la chica que amo",
            tipo: "foto",
            contenido: "assets/fotos/PXL_20260117_193744641.jpg",
            descripcion: "Feliz siempre por su compañia."
        },
        {
            titulo: "Una promesa sutil",
            tipo: "texto",
            contenido: `No olvides que te amo y estoy orgulloso de tí. 
            Mi corazón siempre estará contigo,
            incluso en los momentos difíciles. 
            Eres mi niña hermosa y siempre lo serás.`,
            descripcion: "Nota mental para el futuro."
        },
        {
            titulo: "Mi niña es la más hermosa",
            tipo: "foto",
            contenido: "assets/fotos/IMG-20250921-WA0024.jpg",
            descripcion: "Su belleza no se puede comparar"
        },
        {
            titulo: "La danzarina que amo",
            tipo: "video",
            contenido: "assets/fotos/VID-20251213-WA0165.mp4",
            descripcion: "Ver cómo ama a Dios me hace amarla más"
        },
        {
            titulo: "Mi niña logrará cosas grandes",
            tipo: "foto",
            contenido: "assets/fotos/IMG-20260519-WA0072.jpg",
            descripcion: "Yo estoy muy orgulloso de ella"
        }
        
    ],

    // ==========================================================================
    // 💜 EXCLUSIVO: DATOS INTERACTIVOS DE LA DIMENSIÓN 2 (EL CORAZÓN)
    // ==========================================================================
    dimension2: [
        { 
            t: Math.PI * 0.25, 
            tipo: 'foto',   
            titulo: 'MI SUEÑO',   
            descripcion: `No importa cuánto pude haber imaginado, superaste mis sueños y brillas en mi corazón`,
            contenido: 'assets/fotos/Picsart_25-07-09_14-13-24-810.jpg' 
        },
        { 
            t: Math.PI * 0.75, 
            tipo: 'video', 
            titulo: 'MI HORIZONTE',  
            descripcion: `Así cómo el sol se asoma en el ancho mar, tú apareciste para llenar mi horizonte de luz`,
            contenido: 'assets/fotos/VID-20260405-WA0091.mp4' 
        },
        { 
            t: Math.PI * 1.25, 
            tipo: 'foto',   
            titulo: 'MI PAZ',  
            descripcion: `¿Recuerdas la paz que sentíamos? No era el lugar, eras tú dándole a mi corazón descanso`,
            contenido: 'assets/fotos/PXL_20260118_125852048.jpg' 
        },
        { 
            t: Math.PI * 1.75, 
            tipo: 'video', 
            titulo: 'MI LUZ', 
            descripcion: `Es tu luz la que me ha guiado muchas veces en medio de la oscuridad, y la que me ha dado esperanza para seguir adelante`,
            contenido: 'assets/fotos/VID-20260503-WA0056.mp4' 
        }
    ]
};
