import { Dietitian } from '../types/dietitian';

export const mockDietitians: Dietitian[] = [
  {
    id: "d1",
    name: "Dr. Amira Benali",
    title: "Médecin Nutritionniste",
    specialties: ["Diabète", "Perte de Poids", "Nutrition Sportive"],
    wilaya: "16 - Alger",
    contact: {
      phone: "0555 12 34 56",
      email: "contact@amiranutrition.dz",
      instagram: "@dr.amira_nutrition",
      address: "Hydra, Alger"
    }
  },
  {
    id: "d2",
    name: "Yacine Merah",
    title: "Diététicien Clinicien",
    specialties: ["Obésité", "Maladies Cardiovasculaires"],
    wilaya: "31 - Oran",
    contact: {
      phone: "0770 98 76 54",
      instagram: "@yacine_diet",
      address: "Akid Lotfi, Oran"
    }
  },
  {
    id: "d3",
    name: "Amina Kaddour",
    title: "Experte en Rééquilibrage Alimentaire",
    specialties: ["Perte de Poids", "Femmes Enceintes"],
    wilaya: "25 - Constantine",
    contact: {
      phone: "0661 11 22 33",
      email: "amina.diet@gmail.com",
      address: "Nouvelle Ville Ali Mendjeli"
    }
  },
  {
    id: "d4",
    name: "Dr. Sofiane Touati",
    title: "Nutritionniste & Coach Sportif",
    specialties: ["Nutrition Sportive", "Prise de Masse"],
    wilaya: "19 - Sétif",
    contact: {
      instagram: "@coach_sofiane_dz",
      address: "Centre Ville, Sétif"
    }
  },
  {
    id: "d5",
    name: "Lamia Zerrouki",
    title: "Diététicienne Spécialisée",
    specialties: ["Diabète", "Intolérances Alimentaires"],
    wilaya: "16 - Alger",
    contact: {
      phone: "0550 44 55 66",
      email: "lamia.z@nutrition.dz",
      address: "El Biar, Alger"
    }
  }
];
