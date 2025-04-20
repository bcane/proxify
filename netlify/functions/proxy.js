const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { httpMethod, headers, path, queryStringParameters } = event;

    // Construct the target URL
    const targetUrl = `https://example.com${path}`; // Change this to your target URL

    // Prepare the options for the fetch request
    const options = {
        method: httpMethod,
        headers: {
            ...headers,
            // Optionally, you can modify or add headers here
            'X-Forwarded-For': event.requestContext.identity.sourceIp,
        },
        body: httpMethod !== 'GET' ? JSON.stringify(event.body) : null,
    };

    try {
        const response = await fetch(targetUrl, options);
        const responseBody = await response.text();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type'),
                // Forward any other headers you want
            },
            body: responseBody,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};
