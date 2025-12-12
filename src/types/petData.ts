export type HealthEvent = {
  id?: string;
  date?: string;
  description?: string;
};

export type Caretaker = {
  name: string;
  email: string;
};

export type PetData = {
  pet_id?: string;
  owner_id: string;
  pet_name: string;
  avatar: string;
  birthday: string;
  size: string;
  type: string;
  sex: string;
  weight: string;
  caretakers: Caretaker[];
  health_events: HealthEvent[];
  activity_events: HealthEvent[];
  nutrition_events: HealthEvent[];
  created_at: string;
  updated_at: string;
};

