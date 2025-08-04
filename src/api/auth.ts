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
    role: string;
    region: string;
    district: string;
  };
}

import { ACCOUNTS_ENDPOINT } from "@/utils/endpoints";
import { getAuthToken } from "@/utils/cookie";

export const register = async (data: RegisterData) => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "/register/", {
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
  const response = await fetch(ACCOUNTS_ENDPOINT + "/login/", {
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
  const response = await fetch(ACCOUNTS_ENDPOINT + "/logout/", {
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
  const response = await fetch(ACCOUNTS_ENDPOINT + "/change-password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ old_password: currentPassword, new_password: newPassword }),
  });
  return response.json();
};

export const requestPasswordResetAPI = async (email: string) => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "/request-password-reset/", {
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
    const response = await fetch(ACCOUNTS_ENDPOINT + "/validate-reset-token/", {
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
  const response = await fetch(ACCOUNTS_ENDPOINT + "/reset-password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, token, new_password: newPassword }),
  });
  return response.json();
};

export const getUser = async () => {
  const response = await fetch(ACCOUNTS_ENDPOINT + "/user/", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error getting user");
  }
};

// Google Authentication methods
export const getGoogleAuthUrl = async (): Promise<string> => {
  try {
    const response = await fetch(ACCOUNTS_ENDPOINT + "/google/login/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get Google auth URL");
    }

    const data = await response.json();
    return data.auth_url;
  } catch (error) {
    console.error("Error getting Google auth URL:", error);
    throw error;
  }
};

export const googleAuthenticate = async (code: string): Promise<AuthResponse> => {
  try {
    // URL decode the code if it's encoded
    const decodedCode = decodeURIComponent(code);
    console.log('Authenticating with Google code:', decodedCode);

    const response = await fetch(ACCOUNTS_ENDPOINT + "/google/callback/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: decodedCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google auth error response:", data);
      throw new Error(data.error || "Google authentication failed");
    }

    console.log("Google authentication successful");
    return data;
  } catch (error) {
    console.error("Google authentication error:", error);
    throw error;
  }
};