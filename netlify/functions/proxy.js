const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { method, headers, body } = event;

    // Extract the target URL from query parameters
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing target URL' }),
        };
    }

    try {
        const response = await fetch(targetUrl, {
            method,
            headers,
            body: method !== 'GET' ? body : undefined,
        });

        const data = await response.text();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type'),
            },
            body: data,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
