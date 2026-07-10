export interface Dietitian {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  wilaya: string;
  contact: {
    phone?: string;
    email?: string;
    instagram?: string;
    address?: string;
  };
}
