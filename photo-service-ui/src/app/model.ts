export interface Photo {
  id: number;
  name: string;
  description: string;
  url: string;
  user: User;
  categories: Category[];
}

export interface User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    profile: {
      gender: string;
      photo: string;
    };
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
  }