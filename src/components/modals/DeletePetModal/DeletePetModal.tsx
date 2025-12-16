import React from "react";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { PetData } from "@/types/petData";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/utils/tostify";
import { petService } from "@/services/pet-service";
import darkX from "../../../../public/images/icons/dark-close.svg";
import lightX from "../../../../public/images/icons/close.svg";

type DeletePetModalProps = {
  isOpenModal: boolean;
  setIsOpenModal: (i: boolean) => void;
  pet: PetData;
};

const DeletePetModal: React.FC<DeletePetModalProps> = ({
  isOpenModal,
  setIsOpenModal,
  pet,
}) => {
  const { theme } = useAppSelector((state) => state.theme);
  const x = theme === "dark" ? darkX : lightX;
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await petService.deletePet(pet.pet_id || "");
      showSuccessToast(`${pet.pet_name} has been deleted.`);
      setIsOpenModal(false);
      router.push("/pets-list");
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to delete pet. Please try again.");
    }
  };

  if (!isOpenModal) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpenModal(false);
      }}
      className="z-[10000000] fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 h-[100%] w-[100%] bg-opacity-45 bg-black"
    >
      <div className="overflow-hidden relative sm:w-[70%] w-full max-w-[600px] py-6 rounded-2xl bg-white dark:bg-sidebar-bg">
        <button
          onClick={() => setIsOpenModal(false)}
          className="absolute sm:right-[32px] right-[24px] top-[24px]"
        >
          <Image src={x} alt="Close" width={24} height={24} />
        </button>

        <div className="px-8 flex flex-col justify-between">
          <h2 className="font-700 sm:text-28px text-20px mb-[20px] dark:text-white text-dark-gray-text">
            Delete Profile
          </h2>

          <p className="text-24px my-[60px] font-600 text-center dark:text-white text-dark-gray-text">
            Do you want to delete {pet.pet_name}?
            <br />
            <small className="text-[red]">This action cannot be undone.</small>
          </p>

          <div className="w-[200px] mx-auto">
            <CustomButton title="Delete" type="button" onClick={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePetModal;
