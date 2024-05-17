export type PetPayload={
    petName: string;
    type: string;
    size: string;
    sex: string;
    birthday: string;
    weight: string;

}
export type PetPayloadA={
    petName: string| null;
    type: string| null;
    sex: string | null;
    birthday: string | null;
    size: string | null;
    avatar: string;
    weight: string|null;
}