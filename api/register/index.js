const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "WebServicesDB";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);

module.exports = async function (context, req) {
    if (req.method !== "POST") {
        context.res = { status: 405, body: "Method not allowed" };
        return;
    }

    const newUser = req.body;

    if (!newUser || !newUser.id || !newUser.email || !newUser.nombre) {
        context.res = { status: 400, body: "Faltan campos obligatorios" };
        return;
    }

    try {
        const container = database.container("Users");
        const { resource: createdUser } = await container.items.create(newUser);

        context.res = {
            status: 201,
            body: createdUser
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
