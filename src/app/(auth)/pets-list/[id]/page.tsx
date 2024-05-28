import React from 'react';
import PetPage from "@/components/pages/pet/PetPage";
type PetProps = {
    params: { id: string;};
}
export default function Pet({params}:PetProps) {
    return (
        <PetPage id={params.id}/>
    );
}
