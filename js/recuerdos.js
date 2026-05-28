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
        tipo: "texto",
        contenido: "Aquí va ese mensaje largo y profundo que se escribirá en máquina de escribir...",
        textura: "assets/fotos/textura-planeta-2.jpg",
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
        descripcion: "Haz clic para vernos, este día fue hermoso por... 📸", // 🌟 CAMBIADO A: descripcion
        textura: "assets/fotos/textura-planeta-1.jpg", 
        color: 0x3b82f6, 
        tamano: 1.5,
        distancia: 16,   
        velocidad: 0.01  
    },
    {
        id: 3,
        nombre: "Los besitos que tanto adoras",
        tipo: "video",
        contenido: "assets/fotos/VID_45450913_045128_765.mp4", 
        descripcion: "Un recuerdo en movimiento de esos besos que tanto extraño. 💖", // 🌟 CAMBIADO A: descripcion
        textura: "assets/fotos/textura-planeta-3.jpg", 
        color: 0x10b981, 
        tamano: 1.4,
        distancia: 22,
        velocidad: 0.008
    },
    {
        id: 4,
        nombre: "El Horizonte Compartido",
        tipo: "foto",
        contenido: "assets/fotos/Picsart_26-05-28_00-24-43-602.jpg", 
        descripcion: "Un anillo de promesas en el horizonte. 🪐", // 🌟 CAMBIADO A: descripcion
        textura: "assets/fotos/textura-planeta-3.jpg", 
        color: 0xf59e0b, 
        tamano: 2.2,          
        distancia: 32,        
        velocidad: 0.004      
    },
    {
        id: 5,
        nombre: "El Infinito de tus Ojos",
        tipo: "foto",
        contenido: "assets/fotos/IMG-20260423-WA0206.jpg",
        descripcion: "En los confines del espacio reflejado en tu mirada. 🌌", // 🌟 CAMBIADO A: descripcion
        textura: "assets/fotos/textura-planeta-4.jpg", 
        color: 0x06b6d4,      
        tamano: 1.0,          
        distancia: 42,        
        velocidad: 0.002      
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
        
    ]
};