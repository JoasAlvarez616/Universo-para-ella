// js/recuerdos.js

export const CONFIG_UNIVERSO = {
    // Configuración general del Sol Central (Ustedes)
    sol: {
        nombre: "Nosotros",
        foto: "assets/fotos/Picsart_26-05-26_19-18-55-452.jpg", // Asegúrate de tener esta foto en esa ruta
        tamano: 4,                        // Tamaño visual en el espacio 3D
        descripcion: "El centro de mi universo. Donde todo comenzó y hacia donde todo gravita."
    },

    // Lista de planetas (Tus recuerdos y mensajes)
    // Puedes duplicar, quitar o añadir tantos como quieras. El sistema los acomodará solos.
    planetas: [
        {
            id: 1,
            nombre: "El Inicio",
            tipo: "texto", // Puede ser "texto" o "foto"
            contenido: "Aquí va ese mensaje largo y profundo... Puedes escribir varios párrafos sobre el día en que se conocieron, lo que sentiste la primera vez que la viste o cualquier detalle que la haga sonreír.",
            textoFlotante: "Léeme primero ✨",
            color: 0x8b5cf6, // Color morado/nebulosa en formato hexadecimal (Three.js)
            tamano: 1.2,
            distancia: 10,   // Qué tan lejos gira alrededor del Sol
            velocidad: 0.015 // Qué tan rápido orbita
        },
        {
            id: 2,
            nombre: "Nuestra Foto Favorita",
            tipo: "foto",
            contenido: "assets/fotos/PXL_20260118_130237703.jpg", // Ruta de la foto que vas a guardar
            textoFlotante: "Haz clic para vernos 📸",
            color: 0x3b82f6, // Color azul cósmico
            tamano: 1.5,
            distancia: 16,   // Más lejos que el planeta 1 para que no choquen
            velocidad: 0.01  // Un poco más lento para simular física real
        },
        {
            id: 3,
            nombre: "Un Recordatorio",
            tipo: "texto",
            contenido: "Te amo no solo por quien eres, sino por quien soy cuando estoy contigo. Gracias por ser mi lugar seguro en este enorme cosmos.",
            textoFlotante: "Para cuando me extrañes ❤️",
            color: 0xec4899, // Color rosa brillante / magenta
            tamano: 1.0,
            distancia: 22,
            velocidad: 0.008
        }
    ]
};