

export type ID = string;

export interface Speciality {
    id: ID;
    name: string;
}

export interface Clinic {
    id: ID;
    name: string;
    address: string;
    telephone: string;
    specialityIds: ID[];
}

export interface Doctor {
    id: ID;
    clinicId: ID;
    specialityId: ID;
    firstName: string;
    lastName: string;
    telephone: string;
    durations: number[];
}

export interface OwnerInfo {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
}

export interface PetInfo {
    name: string;
    species: string;
    breed: string;
    age: string;
    notes?: string;
}

export interface Appointment {
    id: ID;
    clinicId: ID;
    doctorId: ID;
    startISO: string;
    duration: number;
    owner: OwnerInfo;
    pet: PetInfo;
}
