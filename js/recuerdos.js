// js/recuerdos.js

export const CONFIG_UNIVERSO = {
    // Configuración general del Sol Central (Ustedes)
    sol: {
        nombre: "Nosotros",
        foto: "assets/fotos/Picsart_26-05-26_19-18-55-452.jpg", 
        tamano: 4,                        
        descripcion: "El centro de mi universo. Donde todo comenzó y hacia donde todo gravita."
    },

    // 🪐 LISTA DE PLANETAS (Tus hitos principales u órbitas cercanas)
    planetas: [
        {
            id: 1,
            nombre: "El Inicio",
            tipo: "texto", // Puede ser "texto", "foto" o "video"
            contenido: "Aquí va ese mensaje largo y profundo... Puedes escribir varios párrafos sobre el día en que se conocieron, lo que sentiste la primera vez que la viste.",
            textoFlotante: "Léeme primero ✨",
            color: 0x8b5cf6, 
            tamano: 1.2,
            distancia: 10,   
            velocidad: 0.015 
        },
        {
            id: 2,
            nombre: "Nuestras Fotos Favoritas",
            tipo: "foto",
            contenido: "assets/fotos/Picsart_26-05-27_15-37-14-054.jpg", 
            textoFlotante: "Haz clic para vernos 📸",
            color: 0x3b82f6, 
            tamano: 1.5,
            distancia: 16,   
            velocidad: 0.01  
        },
        {
            id: 3,
            nombre: "Los besitos que tanto adoras",
            tipo: "video", // <-- NUEVO TIPO: VIDEO
            contenido: "assets/fotos/VID_45450913_045128_765.mp4", // Guarda tus videos en formato .mp4 dentro de esta carpeta
            textoFlotante: "Un recuerdo en movimiento",
            color: 0x10b981, // Verde esmeralda cósmico
            tamano: 1.4,
            distancia: 22,
            velocidad: 0.008
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
            contenido: "Incluso si el universo entero se expandiera hasta quedar a oscuras, buscaría la forma de encender una estrella para ti. Prometo estar siempre.",
            descripcion: "Nota mental para el futuro."
        }
    ]
};