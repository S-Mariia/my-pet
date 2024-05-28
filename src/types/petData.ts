export type HealthEvent={
    id?: string;
    date?: string;
    description?: string;
}

export type Caretaker={
    name: string;
    email: string;
}

export type PetData = {
    avatar?: string;
    birthday?: string;
    petId?: string;
    petName?: string;
    size?: string;
    type?: string;
    sex?: string;
    caretakers?: Caretaker[];
    healthEvents?: HealthEvent[];
    activityEvents?:HealthEvent[];
    nutritionEvents?: HealthEvent[];
    weight?: string
}
