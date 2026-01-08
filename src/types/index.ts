export type PageT = {
  title: string,
  link: string,  
}

export interface LoginRequestT {
  email: string;
  password: string;
}

export interface AuthResponseT {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type SignupRequestT = {
  name: string;
  email: string;
  password: string;
};

export type UserT = {
  id: string;
  name: string;
  email: string;
};
