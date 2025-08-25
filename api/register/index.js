const { CosmosClient } = require("@azure/cosmos");

// Variables de entorno - ESTAS DEBEN ESTAR CONFIGURADAS EN AZURE
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "Speedcola";
const containerId = "Users";

module.exports = async function (context, req) {
    context.log('=== REGISTRO DE USUARIO INICIADO ===');
    context.log('Método HTTP:', req.method);
    context.log('Datos recibidos:', JSON.stringify(req.body));
    
    // Verificar método HTTP
    if (req.method !== "POST") {
        context.log('Método no permitido:', req.method);
        context.res = { 
            status: 405, 
            body: { error: "Method not allowed" }
        };
        return;
    }

    // Verificar variables de entorno
    context.log('Verificando variables de entorno...');
    context.log('COSMOS_DB_ENDPOINT existe:', !!endpoint);
    context.log('COSMOS_DB_KEY existe:', !!key);
    
    if (!endpoint || !key) {
        context.log('ERROR: Variables de entorno no configuradas');
        context.res = {
            status: 500,
            body: { 
                error: "Variables de entorno de Cosmos DB no configuradas",
                details: {
                    endpoint_exists: !!endpoint,
                    key_exists: !!key
                }
            }
        };
        return;
    }

    // Validar datos del usuario
    const newUser = req.body;
    context.log('Validando datos del usuario...');
    
    if (!newUser || !newUser.id || !newUser.email || !newUser.nombre) {
        context.log('ERROR: Campos obligatorios faltantes');
        context.log('Campos recibidos:', Object.keys(newUser || {}));
        context.res = { 
            status: 400, 
            body: { 
                error: "Faltan campos obligatorios",
                required: ["id", "email", "nombre"],
                received: Object.keys(newUser || {})
            }
        };
        return;
    }

    try {
        context.log('Conectando a Cosmos DB...');
        context.log('Endpoint:', endpoint);
        
        // Crear cliente de Cosmos DB
        const client = new CosmosClient({ endpoint, key });
        const database = client.database(databaseId);
        const container = database.container(containerId);
        
        context.log('Creando usuario en Cosmos DB...');
        context.log('Database ID:', databaseId);
        context.log('Container ID:', containerId);
        context.log('Usuario a crear:', JSON.stringify(newUser));
        
        // Crear el usuario en Cosmos DB
        const { resource: createdUser } = await container.items.create(newUser);
        
        context.log('¡Usuario creado exitosamente!');
        context.log('Usuario creado:', JSON.stringify(createdUser));

        context.res = {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                success: true,
                message: "Usuario registrado correctamente",
                user: createdUser
            }
        };

    } catch (error) {
        context.log('=== ERROR EN COSMOS DB ===');
        context.log('Mensaje de error:', error.message);
        context.log('Código de error:', error.code);
        context.log('Stack trace:', error.stack);
        
        // Errores específicos de Cosmos DB
        let errorMessage = error.message;
        let statusCode = 500;
        
        if (error.code === 409) {
            errorMessage = "Usuario ya existe";
            statusCode = 409;
        } else if (error.code === 404) {
            errorMessage = "Base de datos o contenedor no encontrado";
            statusCode = 500;
        }
        
        context.res = {
            status: statusCode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: { 
                error: errorMessage,
                cosmosError: error.message,
                code: error.code
            }
        };
    }
};