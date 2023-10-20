export class AuthenticationRequest {
    emailAddress ?: string;
    password ?: string;
}

export interface JwtToken {
    token ?: string;
}

export interface User {
    jti ?: string;
    iss ?: string
    aud ?: string
    sub ?: string
    name ?: string;
    emailAddress ?: string;
    password ?: string;
    phoneNumber ?: string;
    isBusinessOwner ?: boolean;
    iat ?: number;
    exp ?: number;
}

