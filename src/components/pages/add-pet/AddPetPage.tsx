"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import {
  defaultValues,
  schema,
} from "@/components/pages/add-pet/schema/addPet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLoading } from "@/redux/slices/loading/loadingSlice";
import { setPetsListA } from "@/redux/slices/petsList/petsListSlice";
import Calendar from "@/components/common/Calendar/Calendar";
import ControlInput from "@/components/common/ControlInput/ControlInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import ControlSelect from "@/components/common/ControlSelect/ControlSelect";
import InfoSideHeader from "@/components/common/InfoSideHeader/InfoSideHeader";
import { PetData } from "@/types/petData";
import plus from "../../../../public/images/icons/plusb-white.svg";
import dogsDark from "../../../../public/images/dashbord/dark-empty-db.svg";
import dogsLight from "../../../../public/images/dashbord/light-empty-db.svg";
import { petSexOptions, petSizeOptions } from "@/constans/selectOptions";
import { showErrorToast, showSuccessToast } from "@/utils/tostify";
import { petService } from "@/services/pet-service";

type FormData = {
  pet_name: string;
  type: string;
  sex: string;
  size: string;
  weight: string;
  birthday: string;
};

export default function AddPetPage() {
  const { theme } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.user);
  const { petsList } = useAppSelector((state) => state.petsList);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const logo = theme === "dark" ? dogsDark : dogsLight;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = methods;

  const petNameWatch = watch("pet_name");
  const uniquenessCheck = petsList?.some(
    (pet) => pet.pet_name === (petNameWatch || "").trim()
  )
    ? "You already have a pet with this name in your pet list."
    : "";

  const uploadAvatar = async (): Promise<string> => {
    if (!avatar) return "";
    try {
      return URL.createObjectURL(avatar);
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to upload avatar.");
      return "";
    }
  };

  const onSubmit = async (formData: FormData) => {
    if (!user) return;
    dispatch(setLoading(true));
    try {
      const avatar_link = avatar ? await uploadAvatar() : "";

      const birthdayISO = formData.birthday
        ? new Date(formData.birthday).toISOString().split("T")[0]
        : "";

      const newPet: PetData = {
        owner_id: user.uid,
        pet_name: formData.pet_name || "",
        type: formData.type || "",
        sex: formData.sex || "",
        birthday: birthdayISO,
        size: formData.size || "",
        weight: formData.weight || "",
        avatar: avatar_link,
        caretakers: [],
        health_events: [],
        activity_events: [],
        nutrition_events: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await petService.createPet(newPet);
      showSuccessToast("Pet profile has been successfully added!");
      dispatch(setPetsListA([...(petsList || []), newPet]));
      setAvatar(null);
      setPreview("");
      router.back();
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to add pet. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <InfoSideHeader title="Add Pet Profile" />
      <div className="mt-[30px] flex flex-col gap-[20px]">
        <div className="flex justify-center">
          <div className="relative bg-light-bg-md dark:bg-dark-gray-bg rounded-full w-[fit-content] p-[15px] shadow">
            <div className="relative sm:h-[120px] h-[100px] sm:w-[120px] w-[100px]">
              <Image
                src={preview || logo}
                alt="Pet"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute top-0 sm:h-[120px] h-[100px] sm:w-[120px] w-[100px] flex items-center justify-center dark:bg-sidebar-bg-04 bg-black-bg-04 rounded-full border-[1.5px] border-solid border-circle-border">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Pet preview"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Image src={plus} alt="add new" width={35} height={35} />
                )}
                <input
                  className="cursor-pointer z-10000 absolute top-0 left-0 sm:h-[120px] h-[100px] sm:w-[120px] w-[100px] opacity-0"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target?.files?.[0] || null;
                    setAvatar(file);
                    if (file && file.type.startsWith("image")) {
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

        <div className="flex flex-col gap-[20px] w-full">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap">
                <div className="w-full">
                  <div className="my-[20px]">
                    <div className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[15px]">
                      Pet name
                      <small className="hidden sm:inline ml-[15px] text-[red] max-w-[200px] leading-[0.5]">
                        Attention! It is not possible to change the pet's name
                        in the future.
                      </small>
                    </div>
                    <small className="sm:hidden text-[red] leading-[0.5]">
                      Attention! It is not possible to change the pet's name in
                      the future.
                    </small>
                  </div>
                  <ControlInput
                    type="text"
                    placeholder="Pet name"
                    errorMessage={uniquenessCheck || errors?.pet_name?.message}
                    {...register("pet_name")}
                  />
                </div>

                <div className="sm:min-w-[50%] min-w-full sm:pr-[10px]">
                  <p className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[15px]">
                    Birth date
                  </p>
                  <Calendar
                    name="birthday"
                    errorMessage={errors?.birthday?.message}
                    control={control}
                  />
                </div>

                <div className="sm:min-w-[50%] min-w-full sm:pl-[10px]">
                  <p className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[15px]">
                    Type
                  </p>
                  <ControlInput
                    type="text"
                    placeholder="Cat, dog, etc."
                    errorMessage={errors?.type?.message}
                    {...register("type")}
                  />
                </div>

                <div className="sm:min-w-[50%] min-w-full sm:pr-[10px]">
                  <p className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[15px]">
                    Sex
                  </p>
                  <ControlSelect
                    options={petSexOptions}
                    disabled={false}
                    errorMessage={errors?.sex?.message}
                    {...register("sex")}
                  />
                </div>

                <div className="sm:min-w-[50%] min-w-full sm:pl-[10px]">
                  <p className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[15px]">
                    Size
                  </p>
                  <ControlSelect
                    options={petSizeOptions}
                    disabled={false}
                    errorMessage={errors?.size?.message}
                    {...register("size")}
                  />
                </div>

                <div className="sm:min-w-[50%] min-w-full sm:pr-[10px]">
                  <p className="text-dark-gray-text dark:text-white font-400 leading-136% sm:text-16px text-14px sm:my-[20px] my-[15px]">
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

              <div className="mt-[30px]">
                <CustomButton
                  type="submit"
                  title="Create"
                  disabled={
                    !!uniquenessCheck || !!Object.values(errors)?.length
                  }
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
