import fetch from 'node-fetch';


exports.handler = async (event) => {
    const { httpMethod, headers, path, queryStringParameters } = event;

    // Construct the target URL
    
    const targetUrl = event.queryStringParameters.url.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, "http://");

    // Prepare the options for the fetch request
    const options = {
        method: httpMethod,
        headers: {
            ...headers,
            'x-forwarded-for': event.headers['x-forwarded-for'] || event.ip
        },
        body: httpMethod !== 'GET' ? JSON.stringify(event.body) : null,
    };

    try {
        const response = await fetch(targetUrl, options);
        const responseBody = await response.text();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type')
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
