interface RegisterData {
  //   full_name: string;
  username: string;
  //   email: string;
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
    role: string;
    is_staff: boolean;
    is_superuser: boolean;
    username: string;
    groups: Array<string>;
  };
}

export const register = async (data: RegisterData) => {
  const response = await fetch("http://localhost:8000/accounts/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(data);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error registering user");
  }

  const responseData = await response.json();
  return responseData;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:8000/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return errorData;
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
};

export const logout = async () => {
  const response = await fetch("http://localhost:8000/accounts/logout/", {
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
