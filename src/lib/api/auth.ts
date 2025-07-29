interface RegisterData {
  username: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    email: string
    full_name: string
    gender: string
    is_staff: boolean
    is_superuser: boolean
    username: string
    groups: Array<string>
    role: string
    region: string
    district: string
  }
}

interface ApiError {
  error?: string
  error_message?: string
  detail?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const ACCOUNTS_ENDPOINT = `${API_BASE_URL}/accounts`

async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    const error = data as ApiError
    throw new Error(error.error || error.error_message || error.detail || 'An error occurred')
  }
  
  return data
}

export const register = async (data: RegisterData): Promise<any> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleApiResponse(response)
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.email, // API expects username field but we send email
      password: data.password,
    }),
  })

  return handleApiResponse<AuthResponse>(response)
}

export const logout = async (): Promise<any> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleApiResponse(response)
}

export const requestPasswordReset = async (email: string): Promise<any> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/request-password-reset/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  return handleApiResponse(response)
}

export const validateResetToken = async (uid: string, token: string): Promise<any> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/validate-reset-token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid, token }),
  })

  return handleApiResponse(response)
}

export const resetPassword = async (uid: string, token: string, newPassword: string): Promise<any> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/reset-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid, token, new_password: newPassword }),
  })

  return handleApiResponse(response)
}

export const getGoogleAuthUrl = async (): Promise<string> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/google/login/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await handleApiResponse<{ auth_url: string }>(response)
  return data.auth_url
}

export const googleAuthenticate = async (code: string): Promise<AuthResponse> => {
  const decodedCode = decodeURIComponent(code)
  
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/google/callback/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: decodedCode }),
  })

  return handleApiResponse<AuthResponse>(response)
}

export const getUser = async (token: string): Promise<any> => {
  const response = await fetch(`${ACCOUNTS_ENDPOINT}/user/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleApiResponse(response)
}

export type { RegisterData, LoginData, AuthResponse }