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
            descripcion: "Hay días en los que extraño mucho darte besitosss", 
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
            contenido: "assets/fotos/Mi_Paz.mp4", 
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
            tipo: "video",
            contenido: "assets/fotos/VID-20250802-WA0035.mp4",
            descripcion: `No importa el tiempo, la distancia, ni los obstáculos que el universo nos ponga, 
            siempre encontraré la forma de llegar a ti. Eres mi destino final, mi amor eterno.`,
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
        },

      //Nodos de la nota musical
{ 
    t: 'nota_plica', 
    tipo: 'especial',   
    titulo: 'Y un día seremos felices incluso cuando todos puedan ver',   
    descripcion: '— Morat, Cuando nadie ve',
    contenido: `Si me preguntan por ti
Diré que es mentira
Que toda una vida he soñado contigo
Yo sueño contigo

Si me preguntan por ti
Diré que no es cierto
Que duele por dentro que no estés conmigo
Te quiero conmigo

Te miro, me miras, y el mundo no gira
Todo parece mentira
Tú sigue, yo sigo, es nuestro castigo
Fingir que somos amigos
Y cuando no haya testigos
Mi vida entera te daré
Cuando nadie ve`,
    video: 'assets/fotos/Tik_Tok_-4747.mp4'
},
{ 
    t: 'nota_abajo', 
    tipo: 'especial',   
    titulo: 'Aprenderé a quererte',   
    descripcion: '— Morat, Aprender a quererte',
    contenido: `Para aprender a quererte, voy a estudiar como se cumplen tus sueños
Voy a leerte siempre muy lentamente
Quiero entenderte
Para enseñarte a extrañarme
Voy a escribirte mi canción más honesta
Darte una vida con más sumas que restas
Si tú me dejas, no habrá preguntas, solo respuestas
No descansaré, solo quiero tenerte a mi lado (aquí a mi lado)
Ruego que mi voz te demuestre lo que te he esperado (lo que te he esperado)
Antes de estar junto a ti por toda la vida
Quiero aprender a quererte
Quiero estudiar como se cumplen tus sueños
Voy a leerte siempre muy lentamente
Quiero entenderte
Para enseñarte a extrañarme (quiero enseñarte)
Voy a escribirte mi canción más honesta
Darte una vida con más sumas que restas
Si tú me dejas, no habrá preguntas, solo respuestas
Si tú me dejas, no habrá preguntas
Solo respuestas`,
    video: 'assets/fotos/VID-20260419-WA0026.mp4'
},
{ 
    t: 'nota_centro', 
    tipo: 'especial',   
    titulo: 'Cada día sigue siendo ese "Solo día"',   
    descripcion: '— Morat, en un solo día',
    contenido: `Tal parece que yo, me acostumbré a ti en un sólo día
Que te ando extrañando
Como si hace años que te conocía
Tal parece que yo
En un solo baile te entregué mi vida
Tal parece que el sentimiento venció las reglas que había
Tal parece que yo me acostumbré a ti en un solo día
Que te ando extrañando
Como si hace años que te conocía
Tal parece que yo
En un solo baile te entregué mi vida
Tal parece que el sentimiento venció las reglas que había
Venció las reglas que había`,
    video: 'assets/fotos/lv_7286356558835895557_20231023120214.mp4'  // o video si prefieres
},
        // 📖 Nodos del Libro (10 + 1 lomo)
    { 
        t: 'libro_1', 
        tipo: 'especial',   
        titulo: 'Gracias por aparecer en mi vida',   
        descripcion: '― Alice Kellen, El chico que dibujaba constelaciones',
        contenido: `"Hasta que tú apareciste, porque entonces todo cambió.
        Llegaste cuando ya casi había decidido marcharme"`,
        video: 'assets/fotos/VID-20230901-WA0026.mp4'
    },
    { 
        t: 'libro_2', 
        tipo: 'especial',   
        titulo: 'Una constelación de nuestras vidas',   
        descripcion: '― Alice Kellen, El chico que dibujaba constelaciones',
        contenido: `"Un punto por cada instante importante. Una estrella, una marca que solo tú y yo sepamos descifrar. Será el álbum de nuestras vidas"`,
        video: 'assets/fotos/Snapchat-367420273.mp4'
    },
    { 
        t: 'libro_3', 
        tipo: 'especial',   
        titulo: 'Te espera algo más grande que tus sueños',   
        descripcion: '― Alice Kellen, Nosotros en la Luna',
        contenido: `“No tienes un futuro negro, Ginger. Tienes un futuro inmenso. Una página en blanco delante de ti. Y puedes escribir lo que tú quieras"`,
        foto: 'assets/fotos/IMG-20260124-WA0000.jpg'
    },
    { 
        t: 'libro_4', 
        tipo: 'especial',   
        titulo: 'Nosotros, nuestro universo',   
        descripcion: '― Alice Kellen, El chico que dibujaba constelaciones',
        contenido: `"Susurraste que, si alguna vez volvía a dudar, mirase las constelaciones que habías dibujado en nuestra pared, todas las estrellas que nos habían marcado, las que habíamos cerrado y dejado atrás, las que aún estaban abiertas y casi presentes. Nosotros"`,
        video: 'assets/fotos/2025-06-24-144524816.mp4'
    },
    { 
        t: 'libro_5', 
        tipo: 'especial',   
        titulo: 'Adoro escucharte',   
        descripcion: '― Alice Kellen, Nosotros en la Luna',
        contenido: `"Nunca me había cruzado con alguien que tuviese tanto que decir y que a mí me apeteciese tanto escuchar"`,
        foto: 'assets/fotos/IMG-20230819-WA0029~2.jpg'
    },
    { 
        t: 'libro_6', 
        tipo: 'especial',   
        titulo: 'Estar enamorado es algo más',   
        descripcion: '― Alice Kellen, Nosotros en la Luna',
        contenido: `“Yo no soy ninguna experta, pero creo que estar enamorado es algo más.
        Es sentir un cosquilleo en la tripa cuando la ves. Y no poder dejar de mirarla.
        Echarla de menos incluso teniéndola delante. Desear tocarla a todas horas, hablar de cualquier cosa, de todo y de nada.
        Sentir que pierdes la noción del tiempo cuando estás a su lado. Fijarte en los detalles.
        Querer saber cualquier cosa sobre ella, aunque sea una tontería. ¿Sabes Rhys? En realidad, creo que es como estar permanentemente colgado de la luna.
        Boca abajo. Con una sonrisa inmensa. Sin Miedo.”`,
        video: 'assets/fotos/VID-20260401-WA0012.mp4'
    },
    { 
        t: 'libro_7', 
        tipo: 'especial',   
        titulo: 'Eres tú mi luna',   
        descripcion: '― Alice Kellen, Nosotros en la Luna',
        contenido: `—[La luna] Está llena de cráteres, pero son bonitos, ¿no? mucho más que si fuese una superficie completamente lisa. Tú eres como la luna. Todos somos imperfectos. Todos tenemos agujeros. ¿Y qué? Podemos vivir con esos. Debemos vivir con eso.”`,
        foto: 'assets/fotos/IMG-20260503-WA0086.jpg'
    },
    { 
        t: 'libro_8', 
        tipo: 'especial',   
        titulo: 'No hay normas para nuestro amor',   
        descripcion: '― Alice Kellen, El chico que dibujaba constelaciones',
        contenido: `Porque hay amores que no se pueden comprar, de esos en los que no importa la sangre ni lo que las normas sociales te dicten. Y tú y yo, Gabriel, no estábamos hechos para seguir ninguna norma`,
        video: 'assets/fotos/lv_7268899749711973637_20230929114453.mp4'
    },
    { 
        t: 'libro_9', 
        tipo: 'especial',   
        titulo: 'Intrusa, te quedaste con todo el amor',   
        descripcion: '― Alice Kellen, Nosotros en la Luna',
        contenido: `“Y no porque hubiese visto los mensajes, sino por lo mucho que me jodía que alguien se tomase la libertad de entrar sin antes molestarse en llamar a la puerta de mi vida. Solo se los permitía Ginger. A ella le dejaba colarse por ventanas abiertas, por rendijas ocultas, por el hueco de la chimenea...”`,
        video: 'assets/fotos/VID-20250802-WA0031.mp4'
    },
    { 
        t: 'libro_10', 
        tipo: 'especial',   
        titulo: 'Encontrarte fue mi mayor golpe de suerte',   
        descripcion: '— Marianela dos Santos, En todos mis universos',
        contenido: `"Había cierto consuelo en la creencia de que nuestras vidas se entrelazaban en todos los universos posibles. Como si cada decisión nos hubiera conducido a estar juntos, una y otra vez"`,
        video: 'assets/fotos/Tik_Tok_-4945.mp4'
    },
    { 
        t: 'libro_11', 
        tipo: 'especial',   
        titulo: 'En todos mis univeros te amaría',   
        descripcion: '— Marianela dos Santos, En todos mis universos',
        contenido: `"Si existen otros universos, te buscaré en cada uno y te amaré en todos ellos"`,
        foto: 'assets/fotos/Snapchat-843405868.jpg'
    }
  ]
};
