"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { getDatabase, ref, set } from "@firebase/database";
import InfoSideHeader from "@/components/common/InfoSideHeader/InfoSideHeader";
import SmallLoader from "@/components/common/SmallLoader/SmallLoader";
import Image from "next/image";
import dogsDark from "@/../public/images/dashbord/dark-empty-db.svg";
import dogsLight from "@/../public/images/dashbord/light-empty-db.svg";
import plus from "@/../public/images/icons/plus.svg";
import userDark from "../../../../public/images/icons/user-dark.svg";
import userIcon from "../../../../public/images/icons/user.svg";
import AddCaretakerModal from "@/components/modals/AddCaretakerModal/AddCaretakerModat";
import DeleteCaretakerModal from "@/components/modals/DeleteCaretakerModal/DeleteCaretakerModal";
import CaretakerCard from "@/components/pages/pet/CaretakerCard/CaretakerCard";
import EventBlock from "@/components/pages/pet/EventBlock/EventBlock";
import { noScroll } from "@/utils/noScroll";
import { Caretaker, PetData } from "@/types/petData";
import update from "../../../../public/images/icons/update.svg";
import deleteIcon from "../../../../public/images/icons/delete.svg";
import EditPetModal from "@/components/modals/EditPetModal/EditPetModal";
import DeletePetModal from "@/components/modals/DeletePetModal/DeletePetModal";
import { showErrorToast, showSuccessToast } from "@/utils/tostify";
import { petService } from "@/services/pet-service";

type PetPageProps = {
  id: string;
};
export default function PetPage({ id }: PetPageProps) {
  const { theme } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.user);
  const [pet, setPet] = useState<PetData | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isDeleteCaretaker, setIsDeleteCaretaker] = useState<Caretaker | null>(
    null
  );
  const [isDeletePet, setIsDeletePet] = useState<boolean>(false);

  const [isEditPet, setIsEditPet] = useState<boolean>(false);

  const logo = theme === "dark" ? dogsDark : dogsLight;
  const userImg = theme === "dark" ? userDark : userIcon;

  useEffect(() => {
    noScroll(isOpenModal);
  }, [isOpenModal]);

  useEffect(() => {
    if (user) {
      petService.getPetById(id).then(setPet);
    }
  }, [user, id]);

  const handleUpdatePet = async (payload: Partial<PetData>) => {
    if (!pet) return;
    try {
      const updatedPet = await petService.updatePet(pet.pet_id!, payload);
      setPet(updatedPet);
      showSuccessToast("Pet profile has been successfully updated!");
    } catch (err) {
      showErrorToast("Failed to update pet. Please try again.");
    }
  };

  return pet ? (
    <>
      <InfoSideHeader
        title={pet?.pet_name || "Pet"}
        subtitle={(pet?.type || "") + ", " + (pet?.sex || "")}
      />
      <div className="flex mt-[30px]">
        <div className="mb-[30px] md:w-[60%] w-full md:pr-[30px]">
          <div className="flex w-full justify-center items-center gap-[20px] ">
            <div className="relative bg-light-bg-md dark:bg-dark-gray-bg rounded-full lg:w-[200px] sm:w-[180px] w-[140px] p-[15px] shadow aspect-square">
              <div className="aspect-square  w-full">
                <Image
                  src={pet.avatar || logo}
                  alt={pet.pet_name || "pet"}
                  width={200}
                  height={200}
                  className="w-full aspect-square h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className=" flex justify-end">
              <button
                className="w-[40px] h-[40px] hover:scale-[1.05] transition duration-300 ease-in-out"
                onClick={() => {
                  setIsEditPet(true);
                }}
              >
                <Image src={update} alt="update" height={40} width={40} />
              </button>
            </div>
            <button
              className="w-[40px] h-[40px] min-w-[30px] min-h-[30px] hover:scale-[1.05] transition duration-300 ease-in-out"
              onClick={() => {
                setIsDeletePet(true);
              }}
            >
              <Image src={deleteIcon} alt="log-out" height={40} width={40} />
            </button>
          </div>
          <div className="w-full md:hidden mt-[20px]">
            <p className="text-dark-gray-text dark:text-white font-600 leading-136% text-16px mb-[20px]">
              Caretakers
            </p>
            <div className="flex items-center gap-3  rounded-input mt-[20px]">
              <div className="bg-white dark:bg-dark-gray-bg rounded-full md:h-[70px] md:w-[70px] md:min-h-[70px] md:min-w-[70px] h-[50px] w-[50px] min-h-[50px] min-w-[50px]">
                <Image
                  src={user?.photoURL || userImg}
                  alt="user"
                  height={80}
                  width={80}
                  className="w-full aspect-square h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <p className="text-16px font-600 text-dark-gray-text dark:text-white leading-144%">
                  {user?.displayName}
                </p>
                <span className=" text-14px font-400 leading-157% w-[60%] text-dark-gray-text dark:text-white">
                  {user?.email}
                </span>
              </div>
            </div>
            {!!pet?.caretakers?.length &&
              pet?.caretakers?.map((i: Caretaker, index) => (
                <CaretakerCard
                  onClick={() => setIsDeleteCaretaker(i)}
                  caretaker={i}
                  key={index + i.name}
                />
              ))}
            <div className="my-[20px] text-white dark:text-input-border flex items-center gap-3 ">
              <button
                type="button"
                onClick={() => setIsOpenModal(true)}
                className="h-[50px] w-[50px] min-h-[50px] min-w-[50px] flex items-center justify-center bg-light-bg-md dark:bg-dark-gray-bg rounded-full border-[1.5px] border-solid border-circle-border my-[12px]"
              >
                <Image src={plus} alt="add new" width={24} height={24} />
              </button>
              <p className="text-14px font-400 leading-22px text-circle-border">
                add new
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center my-[15px]">
            <div>
              <p className="text-input-border-dark dark:text-input-border font-400 text-16px leading-150%">
                Gender
              </p>
            </div>
            <div>
              <p className="text-dark-gray-text dark:text-white font-600 text-16px leading-150%">
                {pet.sex}
              </p>
            </div>
          </div>
          <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid" />
          <div className="flex w-full justify-between items-center my-[15px]">
            <div>
              <p className="text-input-border-dark dark:text-input-border font-400 text-16px leading-150%">
                Size
              </p>
            </div>
            <div>
              <p className="text-dark-gray-text dark:text-white font-600 text-16px leading-150%">
                {pet.size}
              </p>
            </div>
          </div>
          <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid" />
          <div className="flex w-full justify-between items-center my-[15px]">
            <div>
              <p className="text-input-border-dark dark:text-input-border font-400 text-16px leading-150%">
                Weight
              </p>
            </div>
            <div>
              <p className="text-dark-gray-text dark:text-white font-600 text-16px leading-150%">
                {pet.weight}
              </p>
            </div>
          </div>
          <EventBlock
            pet={pet}
            handleUpdatePet={handleUpdatePet}
            type={"health"}
          />
          <EventBlock
            pet={pet}
            handleUpdatePet={handleUpdatePet}
            type={"nutrition"}
          />
          <EventBlock
            pet={pet}
            handleUpdatePet={handleUpdatePet}
            type={"activity"}
          />
        </div>
        <div className="md:block hidden w-[40%] border-l-[1.5px] border-solid border-input-border dark:border-input-border-dark pl-[30px]">
          <p className="text-dark-gray-text dark:text-white font-600 leading-136% text-16px mb-[20px]">
            Caretakers
          </p>
          <div className="flex items-center gap-3  rounded-input mt-[20px]">
            <div className="bg-white dark:bg-dark-gray-bg rounded-full min-h-[70px] min-w-[70px] h-[70px] w-[70px]">
              <Image
                src={user?.photoURL || userImg}
                alt="user"
                height={80}
                width={80}
                className="w-full aspect-square h-full object-cover rounded-full"
              />
            </div>
            <div className="flex-1">
              <p className="text-16px font-600 text-dark-gray-text dark:text-white leading-144%">
                {user?.displayName}
              </p>
              <span className=" text-14px font-400 leading-157% w-[60%] text-dark-gray-text dark:text-white">
                {user?.email}
              </span>
            </div>
          </div>
          {!!pet?.caretakers?.length &&
            pet?.caretakers?.map((i: Caretaker, index) => (
              <CaretakerCard
                onClick={() => setIsDeleteCaretaker(i)}
                caretaker={i}
                key={index + i.name}
              />
            ))}
          <div className="my-[20px] text-white dark:text-input-border flex items-center gap-3 ">
            <button
              type="button"
              onClick={() => setIsOpenModal(true)}
              className="h-[70px] w-[70px] flex items-center justify-center bg-light-bg-md dark:bg-dark-gray-bg rounded-full border-[1.5px] border-solid border-circle-border my-[12px]"
            >
              <Image src={plus} alt="add new" width={24} height={24} />
            </button>
            <p className="text-14px font-400 leading-22px text-circle-border">
              add new
            </p>
          </div>
        </div>
      </div>

      {isOpenModal && (
        <AddCaretakerModal
          setIsOpenModal={setIsOpenModal}
          handleUpdate={handleUpdatePet}
          caretakers={pet?.caretakers || []}
        />
      )}

      {!!isDeleteCaretaker && (
        <DeleteCaretakerModal
          isOpenModal={isDeleteCaretaker}
          setIsOpenModal={setIsDeleteCaretaker}
          handleUpdate={handleUpdatePet}
          caretakers={pet.caretakers || []}
          caretaker={isDeleteCaretaker}
        />
      )}
      {isEditPet && (
        <EditPetModal
          setIsOpenModal={setIsEditPet}
          handleUpdate={handleUpdatePet}
          pet={pet}
        />
      )}
      {isDeletePet && (
        <DeletePetModal
          isOpenModal={isDeletePet}
          setIsOpenModal={setIsDeletePet}
          pet={pet}
        />
      )}
    </>
  ) : (
    <SmallLoader />
  );
}
