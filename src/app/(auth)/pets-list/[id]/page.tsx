import React from "react";
import PetPage from "@/components/pages/pet/PetPage";

type PetProps = {
  params: { id: string };
};

export default async function Pet({ params }: PetProps) {
  const { id } = await params;
  return <PetPage id={id} />;
}
