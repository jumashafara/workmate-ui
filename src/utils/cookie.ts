import Cookies from 'js-cookie';

interface CookieOptions {
    expires?: number; // days
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
}

const DEFAULT_OPTIONS: CookieOptions = {
    expires: 7, // 7 days
    secure: true,
    sameSite: 'strict',
    path: '/'
};

export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    Cookies.set(name, value, opts);
};

export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};

export const removeCookie = (name: string, options: Partial<CookieOptions> = {}): void => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    Cookies.remove(name, opts);
};

export const setAuthToken = (token: string): void => {
    setCookie('access_token', token, {
        expires: 1, // 1 day for access token
        secure: true,
        sameSite: 'strict'
    });
};

export const setRefreshToken = (token: string): void => {
    setCookie('refresh_token', token, {
        expires: 30, // 30 days for refresh token
        secure: true,
        sameSite: 'strict'
    });
};

export const getAuthToken = (): string | null => {
    return getCookie('access_token') || null;
};

export const getRefreshToken = (): string | null => {
    return getCookie('refresh_token') || null;
};

export const setUserData = (userData: {
    email: string;
    full_name: string;
    username: string;
    role: string;
    region: string;
    district: string;
    superuser: boolean;
}): void => {
    setCookie('user_email', userData.email);
    setCookie('user_full_name', userData.full_name);
    setCookie('user_username', userData.username);
    setCookie('user_role', userData.role);
    setCookie('user_region', userData.region);
    setCookie('user_district', userData.district);
    setCookie('user_superuser', userData.superuser.toString());
};

export const getUserData = () => {
    return {
        email: getCookie('user_email') || null,
        full_name: getCookie('user_full_name') || null,
        username: getCookie('user_username') || null,
        role: getCookie('user_role') || null,
        region: getCookie('user_region') || null,
        district: getCookie('user_district') || null,
        superuser: getCookie('user_superuser') === 'true'
    };
};

export const clearAuthCookies = (): void => {
    removeCookie('access_token');
    removeCookie('refresh_token');
    removeCookie('user_email');
    removeCookie('user_full_name');
    removeCookie('user_username');
    removeCookie('user_role');
    removeCookie('user_region');
    removeCookie('user_district');
    removeCookie('user_superuser');
};