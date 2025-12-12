"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import ControlInput from "@/components/common/ControlInput/ControlInput";
import ControlSelect from "@/components/common/ControlSelect/ControlSelect";
import { petSizeOptions } from "@/constans/selectOptions";
import { schema } from "@/components/pages/add-pet/schema/addPet";
import plus from "../../../../public/images/icons/plusb-white.svg";
import dogsDark from "../../../../public/images/dashbord/dark-empty-db.svg";
import dogsLight from "../../../../public/images/dashbord/light-empty-db.svg";
import { useAppSelector } from "@/redux/hooks";
import SmallLoader from "@/components/common/SmallLoader/SmallLoader";
import darkX from "../../../../public/images/icons/dark-close.svg";
import lightX from "../../../../public/images/icons/close.svg";
import { PetData } from "@/types/petData";
import moment from "moment/moment";

type EditPetModalProps = {
  setIsOpenModal: (i: boolean) => void;
  handleUpdate: (payload: Partial<PetData>) => void;
  pet: PetData;
};

const EditPetModal: React.FC<EditPetModalProps> = ({
  setIsOpenModal,
  handleUpdate,
  pet,
}) => {
  const { theme } = useAppSelector((state) => state.theme);
  const logo = theme === "dark" ? dogsDark : dogsLight;
  const x = theme === "dark" ? darkX : lightX;

  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    pet_id,
    caretakers,
    health_events,
    activity_events,
    nutrition_events,
    ...defaultValues
  } = pet;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const handleCloseModal = () => setIsOpenModal(false);

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", pet.pet_id || Math.random().toString());

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      return data.publicUrl;
    } catch (err) {
      console.error("Error uploading avatar:", err);
      return null;
    }
  };

  const onSubmit = async (formData: {
    pet_name?: string;
    birthday?: string;
    size?: string;
    type?: string;
    sex?: string;
    weight?: string;
  }) => {
    setLoading(true);

    let avatarUrl = pet.avatar;
    if (newAvatar) {
      const url = await uploadAvatar(newAvatar);
      if (url) avatarUrl = url;
    }

    const payload: Partial<PetData> = {
      ...formData,
      avatar: avatarUrl,
    };

    await handleUpdate(payload);
    setLoading(false);
    handleCloseModal();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
      className="z-[10000000] fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 h-[100%] w-[100%] bg-opacity-45 bg-black"
    >
      {loading ? (
        <SmallLoader />
      ) : (
        <div className="overflow-hidden relative sm:w-[80%] w-full max-w-[700px] min-h-[70%] py-6 rounded-2xl bg-white dark:bg-sidebar-bg">
          <button
            onClick={handleCloseModal}
            className="absolute sm:right-[32px] z-[10000000] right-[24px] top-[24px] text-brown-500 font-semibold text-base leading-[11px] mb-4"
          >
            <Image src={x} alt="Close" width={24} height={24} />
          </button>

          <div className="px-8 flex flex-col justify-between">
            <h2 className="font-700 leading-136% sm:text-28px text-20px max-w-[96%] sm:mb-[20px] mb-[15px] dark:text-white text-dark-gray-text">
              Edit information about {pet.pet_name}
            </h2>
            <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid" />

            <div className="flex sm:flex-row flex-col justify-center items-center">
              <div className="mt-[20px] relative sm:mr-[50px] bg-light-bg-md dark:bg-dark-gray-bg rounded-full w-[fit-content] h-[fit-content] p-[15px] shadow">
                <div className="relative h-[120px] w-[120px]">
                  <Image
                    src={preview || pet.avatar || logo}
                    alt="Pet"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute top-0 h-[120px] w-[120px] flex items-center justify-center dark:bg-sidebar-bg-04 bg-black-bg-04 rounded-full border-[1.5px] border-solid border-circle-border">
                    <Image src={plus} alt="Add new" width={35} height={35} />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 h-[120px] w-[120px] opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewAvatar(file);
                        if (file?.type.startsWith("image")) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setPreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-wrap">
                  <div className="sm:min-w-[50%] sm:pr-[10px] min-w-full">
                    <p className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[10px]">
                      Size
                    </p>
                    <ControlSelect
                      options={petSizeOptions}
                      disabled={false}
                      errorMessage={errors?.size?.message}
                      {...register("size")}
                    />
                  </div>
                  <div className="sm:min-w-[50%] sm:pl-[10px] min-w-full">
                    <p className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[10px]">
                      Weight
                    </p>
                    <ControlInput
                      type="text"
                      placeholder="Weight"
                      errorMessage={errors?.weight?.message}
                      {...register("weight")}
                    />
                  </div>
                </div>

                <div className="w-[200px] mx-[auto] mt-[30px]">
                  <CustomButton
                    type="submit"
                    title="Save"
                    disabled={!!Object.values(errors)?.length}
                  />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPetModal;
