const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error{
    constructor(
        public status:number,
        message:string
    ){
        super(message);
        this.name = 'ApiError'
    }
}

async function request<T>(path:string, options:RequestInit={}):Promise<T>{
    if(!API_URL){
        throw new Error('API_URL is not configured in .env');
    }
    const headers = new Headers(options.headers);
    const isFormData = options.body instanceof FormData;

    if(!isFormData && !headers.has('Content-Type')){
        headers.set("Content-Type","application/json");
    }

    const response = await fetch(`${API_URL}${path}`,{
        ...options,
        headers,
        credentials:'include',
        cache:'no-store'
    });

    if(response.status === 204){
        return undefined as T
    }

    const data = await response.json().catch(() => null);
    if(!response.ok){
        const message = typeof data?.message === 'string' ? data.message : `Request failed: ${response.status}`
        console.error("API error response:", data);
        throw new ApiError(response.status,message)
    }

    return data as T;
}

export const apiClient = {
    get<T>(path:string, options:RequestInit = {}){
        return request<T>(path, options);
    },

    post<T>(path:string, body:unknown){
        return request<T>(path,{method:'POST',body:body instanceof FormData ? body : JSON.stringify(body)})
    },

    patch<T>(path:string,body:unknown){
        return request<T>(path,{method:'PATCH',body:JSON.stringify(body)})
    },

    del<T>(path:string){
        return request<T>(path,{method:'DELETE'})
    }
}