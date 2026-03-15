
export interface NewUser {
  email: string;
  name: string;
  password: string;
  token: string;
}

export interface RegUserResponse {
  status: string;
  status_code: number;
  user: object;
  error: string;
  message: string;
  isLoading: boolean;
}