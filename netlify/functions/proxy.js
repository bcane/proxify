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
        let response_headers = {};
        const { data, type: originType } = await fetch(url, {
            headers: {
                ...pick(event.headers, ['cookie', 'dnt', 'referer']),
                //'user-agent': '',
                'x-forwarded-for': event.headers['x-forwarded-for'] || event.ip,
                via: 'netlify'
            }
        }).then(async res => {
            if (!res.ok) {
                return {
                    statusCode: res.status || 302
                }
            }

            response_headers = res.headers;
            return {
                body: await res.buffer(),
                type: res.headers.get("content-type") || ""
            }
        })

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
