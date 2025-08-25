module.exports = async function (context, req) {
    context.log('Function triggered with method:', req.method);
    
    // Test with both GET and POST
    if (req.method === "GET") {
        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: { 
                message: "Function is working!", 
                method: req.method,
                timestamp: new Date().toISOString()
            }
        };
        return;
    }
    
    if (req.method === "POST") {
        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: { 
                message: "POST method working!", 
                method: req.method,
                body: req.body,
                timestamp: new Date().toISOString()
            }
        };
        return;
    }
    
    context.res = {
        status: 405,
        headers: { "Content-Type": "application/json" },
        body: { 
            error: `Method ${req.method} not allowed`,
            allowedMethods: ["GET", "POST"]
        }
    };
};