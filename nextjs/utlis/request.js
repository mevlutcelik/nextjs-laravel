export const post = async ({endpoint, body = null, bearerToken = null, csrfToken = null, customUrl = null}) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (bearerToken){
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const responseUrl = customUrl ? customUrl : `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;

    const response = await fetch(responseUrl, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : null,
    });

    return await response.json();
}

export const get = async ({endpoint, bearerToken = null}) => {
    const headers = {};

    if (bearerToken){
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include',
    });

    return await response.json();
}