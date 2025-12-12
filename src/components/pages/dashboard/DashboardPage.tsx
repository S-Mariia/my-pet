"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import dogsDark from "../../../../public/images/dashbord/dark-empty-db.svg";
import dogsLight from "../../../../public/images/dashbord/light-empty-db.svg";
import PetCard from "@/components/pages/dashboard/PetCard/PetCard";
import { useRouter } from "next/navigation";
import InfoSideHeader from "@/components/common/InfoSideHeader/InfoSideHeader";
import SmallLoader from "@/components/common/SmallLoader/SmallLoader";
import { setPetsListA } from "@/redux/slices/petsList/petsListSlice";
import { PetData } from "@/types/petData";
import { petService } from "@/services/pet-service";

export default function DashboardPage() {
  const { theme } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.user);
  const [petsList, setPetsList] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const logo = theme === "dark" ? dogsDark : dogsLight;

  useEffect(() => {
    const fetchPets = async () => {
      if (!user?.uid) return;
      const pets = await petService.getPetsList(user.uid);
      setPetsList(pets);
      setLoading(false);
    };

    fetchPets();
  }, [user]);

  useEffect(() => {
    dispatch(setPetsListA(petsList));
  }, [petsList]);

  if (loading) return <SmallLoader />;
 
  return (
    <>
      <InfoSideHeader title="Pets list" arrow={false} />
      <div className="mt-[20px] flex flex-col gap-[20px] mb-[20px] min-h-[75%]">
        {petsList.length ? (
          <div className="flex flex-wrap sm:justify-between justify-center">
            {petsList.map((pet, index) => (
              <PetCard key={pet.pet_id ?? index} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-sidebar-bg dark:text-white gap-[20px] flex-1">
            <div className="flex flex-col items-center justify-center flex-1">
              <h2 className="font-700 text-34px leading-125% mb-[20px]">
                Uh Oh!
              </h2>
              <p className="dark:text-input-border leading-167% text-18px mb-[50px] max-w-[400px] text-center">
                Looks like you have no profiles set up at this moment, add your
                pet now
              </p>
              <Image
                src={logo}
                alt="user"
                height={200}
                width={200}
                loading="eager"
              />
            </div>
            <div className="max-w-[420px]">
              <CustomButton
                type="button"
                title="Add a pet now"
                onClick={() => router.push("/pets-list/add-pet")}
              />
            </div>
          </div>
        )}
      </div>

      {!!petsList.length && (
        <div className="sticky bottom-[-30px] mb-[-30px] left-0 right-0 pb-[30px] bg-white dark:bg-sidebar-bg">
          <div className="w-[200px] mx-auto">
            <CustomButton
              type="button"
              title="Add a pet now"
              onClick={() => router.push("/pets-list/add-pet")}
            />
          </div>
        </div>
      )}
    </>
  );
}
