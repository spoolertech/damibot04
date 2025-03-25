const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

// Flujo principal de bienvenida y recolección de datos
const flowPrincipal = addKeyword(['hola', 'start', 'bienvenido'])
    .addAnswer('👋🏻 ¡Bienvenido a Villanueva Padel! 🎾\n(San Isidro Labrador)')
    .addAnswer('👉🏻 Por favor, ingresa tu *Nombre* y *Número de Lote* en el siguiente formato: *Juan Pérez Lote 123* ', null, null, [
        // Flujo para cuando el usuario responde con su nombre y lote
        addKeyword([''])
            .addAnswer('🥳 Ahora Ingresa en qué cancha vas a jugar Responde con *1*, *2* o *3*.', null, null, [
                // Variables de control para los intentos fallidos
                addKeyword(['1', '2', '3'])
                    .addAnswer('⚠️ ¿Tenes invitados sin carnet para declarar? 👥👥 \n Responde *SI* o *NO*', null, null, [
                        // Si la respuesta es "no", el bot pasa directamente a la siguiente etapa sin invitados
                        addKeyword(['no', 'n'])
                            .addAnswer('¡Entendido! No tienes invitados para declarar. Ahora puedes comenzar a jugar. ¡Diviértete!'),

                        // Si la respuesta es "sí", el bot pregunta la cantidad de invitados
                        addKeyword(['si','s'])
                            .addAnswer('➡️ ¿Cuántos invitados sin Carnet tenes ❓❓❓ \n Responde con *1*, *2* o *3* ', null, null, [
                                // Espera la respuesta de la cantidad de invitados (1, 2 o 3)
                                addKeyword(['1'])
                                    .addAnswer('🙋🏼  Ingresa el nombre y número de lote del primer invitado (ejemplo: Juan Pérez Lote 123).✅', null, null, [
                                        addKeyword(['']) // Acepta cualquier respuesta, luego avanza
                                            .addAnswer('¡Gracias! Ahora puedes comenzar a jugar. ¡Diviértete!') // Si solo hay un invitado, termina
                                    ]),

                                addKeyword(['2'])
                                    .addAnswer('Ingresa el nombre y número de lote del primer invitado (ejemplo: Juan Pérez Lote 123 o José 123).', null, null, [
                                        addKeyword(['']) // Acepta cualquier respuesta del primer invitado
                                            .addAnswer('🙍🏼‍♂️🙍🏼‍♂️ Ahora ingresa los datos del invitado Nro 2️⃣ del mismo modo que el anterior!!.', null, null, [
                                                addKeyword(['']) // Acepta cualquier respuesta del segundo invitado
                                                    .addAnswer('¡Gracias! Ahora puedes comenzar a jugar. ¡Diviértete!') // Termina después de dos invitados
                                            ])
                                    ]),

                                addKeyword(['3'])
                                    .addAnswer('Ingresa el nombre y número de lote del primer invitado (ejemplo: Juan Pérez Lote 123 o José 123).', null, null, [
                                        addKeyword(['']) // Acepta cualquier respuesta del primer invitado
                                            .addAnswer('🙍🏼‍♂️🙍🏼‍♂️ Ahora ingresa los datos del invitado Nro 2️⃣ del mismo modo que el anterior!!.', null, null, [
                                                addKeyword(['']) // Acepta cualquier respuesta del segundo invitado
                                                    .addAnswer('🤗🤗🤗   Por último, ingresá los datos del invitado Nro 3️⃣ ❗', null, null, [
                                                        addKeyword(['']) // Acepta cualquier respuesta del tercer invitado
                                                            .addAnswer('🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾 \n Gracias por la info!!! ❤️ Todo listo! Ahora podés comenzar a jugar‼️. \n * 🤔 Recordá, si todavía no pasaste, que si querés abonar en efectivo podes acercarte a la oficina y hacerlo. De lo contrario te lo podemos cargar por expensas! 📩 \n * Este sistema NO REEMPLAZA a la reserva por PADELINK, si no la hiciste, hacela asi nadie te pide la cancha 😡 mientras estes jugando 🏓. \n Gracias por elegirnos 😍😍!! Disfruten el partido!!! \n 🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾') // Termina después de tres invitados
                                                    ])
                                            ])
                                    ])
                            ])
                    ]),

                // Si la respuesta no es válida (no es 1, 2 ni 3), repite la pregunta
                addKeyword([''])
                    .addAnswer('Por favor, responde con *1*, *2* o *3* para elegir la cancha.', null, null, [
                        // Si la respuesta sigue siendo incorrecta, repite la pregunta
                        addKeyword([''])
                            .addAnswer('Por favor, responde con *1*, *2* o *3* para elegir la cancha. Si no puedes decidir, escribe uno de esos números.', null, null, [
                                // Repetir el mismo proceso hasta 3 intentos
                                addKeyword(['1', '2', '3'])
                                    .addAnswer('Perfecto. Ahora, ¿Tienes invitados sin carnet para declarar? Responde *SI* o *NO*', null, null, [
                                        // Si la respuesta es "no", el bot pasa directamente a la siguiente etapa sin invitados
                                        addKeyword(['no'])
                                            .addAnswer('¡Entendido! No tienes invitados para declarar. Ahora puedes comenzar a jugar. ¡Diviértete!'),

                                        // Si la respuesta es "sí", el bot pregunta la cantidad de invitados
                                        addKeyword(['si'])
                                            .addAnswer('¡Perfecto! ¿Cuántos invitados tienes? Responde con *1*, *2* o *3* (sin importar el formato de la respuesta).', null, null, [
                                                // Espera la respuesta de la cantidad de invitados (1, 2 o 3)
                                                addKeyword(['1'])
                                                    .addAnswer('Ingresa el nombre y número de lote del primer invitado (ejemplo: Juan Pérez Lote 123 o José 123).', null, null, [
                                                        addKeyword(['']) // Acepta cualquier respuesta, luego avanza
                                                            .addAnswer('¡Gracias! Ahora puedes comenzar a jugar. ¡Diviértete!') // Si solo hay un invitado, termina
                                                    ]),

                                                addKeyword(['2'])
                                                    .addAnswer('Ingresa el nombre y número de lote del primer invitado (ejemplo: Juan Pérez Lote 123 o José 123).', null, null, [
                                                        addKeyword(['']) // Acepta cualquier respuesta del primer invitado
                                                            .addAnswer('Gracias por el primer invitado. Ahora ingresa los datos del segundo invitado (ejemplo: María García Lote 456).', null, null, [
                                                                addKeyword(['']) // Acepta cualquier respuesta del segundo invitado
                                                                    .addAnswer('¡Gracias! Ahora puedes comenzar a jugar. ¡Diviértete!') // Termina después de dos invitados
                                                            ])
                                                    ]),

                                                addKeyword(['3'])
                                                    .addAnswer('Ingresa el nombre y número de lote del primer invitado (ejemplo: Juan Pérez Lote 123 o José 123).', null, null, [
                                                        addKeyword(['']) // Acepta cualquier respuesta del primer invitado
                                                            .addAnswer('Gracias por el primer invitado. Ahora ingresa los datos del segundo invitado (ejemplo: María García Lote 456).', null, null, [
                                                                addKeyword(['']) // Acepta cualquier respuesta del segundo invitado
                                                                    .addAnswer('Gracias por el segundo invitado. Ahora ingresa los datos del tercer invitado (ejemplo: Pedro Gómez Lote 789).', null, null, [
                                                                        addKeyword(['']) // Acepta cualquier respuesta del tercer invitado
                                                                            .addAnswer('¡Todo listo! Ahora puedes comenzar a jugar. ¡Diviértete!') // Termina después de tres invitados
                                                                    ])
                                                            ])
                                                    ])
                                            ])
                                    ])
                            ])
                    ])
            ])
    ]);

// Configuración del flujo de todo el bot
const adapterDB = new MockAdapter();
const adapterFlow = createFlow([flowPrincipal]);

const adapterProvider = createProvider(BaileysProvider);

const main = async () => {
    // Crear el bot con la configuración del flujo, proveedor y base de datos
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    // Generar el portal QR para autenticar la sesión
    QRPortalWeb();
};

main();
