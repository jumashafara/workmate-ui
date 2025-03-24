interface RegisterData {
  username?: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    email: string;
    full_name: string;
    gender: string;
    is_staff: boolean;
    is_superuser: boolean;
    username: string;
    groups: Array<string>;
  };
}

import { ACCOUNTS_ENDPOINT } from "./endpoints";

export const register = async (data: RegisterData) => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 201) {
    const responseData = await response.json();
    return responseData;
  } else {
    const error = await response.json();
    throw new Error(error.error || error.error_message || "Error registering user");
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    const responseData: AuthResponse = await response.json();
    return responseData;
  } else {
    const error = await response.json();
    throw new Error(error.error_message || "Error logging in");
  }
};

export const logout = async () => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error logging out");
  }

  const responseData = await response.json();
  return responseData;
};

export const updatePasswordAPI = async (
  currentPassword: string,
  newPassword: string
) => {
  // Implement the API call to update the password
  const response = await fetch(ACCOUNTS_ENDPOINT + "change-password/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ old_password: currentPassword, new_password: newPassword }),
    }
  );
  return response.json();
};

export const requestPasswordResetAPI = async (email: string) => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "request-password-reset/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const validateResetTokenAPI = async (uid: string, token: string) => {
  console.log('validateResetTokenAPI called with:', { uid, token });
  
  try {
    const response = await fetch(ACCOUNTS_ENDPOINT + "validate-reset-token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, token }),
    });
    
    console.log('validateResetTokenAPI response status:', response.status);
    
    const data = await response.json();
    console.log('validateResetTokenAPI response data:', data);
    
    return data;
  } catch (error) {
    console.error('Error in validateResetTokenAPI:', error);
    throw error;
  }
};

export const resetPasswordAPI = async (uid: string, token: string, newPassword: string) => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "reset-password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, token, new_password: newPassword }),
  });
  return response.json();
};

export const getUser = async () => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "user/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error getting user");
  }
};

// Google Authentication methods
export const getGoogleAuthUrl = async (): Promise<string> => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "google/login/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.auth_url;
  } else {
    const error = await response.json();
    throw new Error(error.error || "Error getting Google auth URL");
  }
};

export const googleAuthenticate = async (code: string): Promise<AuthResponse> => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "google/callback/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (response.ok) {
    const responseData: AuthResponse = await response.json();
    return responseData;
  } else {
    const error = await response.json();
    throw new Error(error.error || "Error authenticating with Google");
  }
};