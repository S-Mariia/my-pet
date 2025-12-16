import React from "react";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "@/components/modals/AddEventModal/schema/addHealth";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import Calendar from "@/components/common/Calendar/Calendar";
import Textarea from "@/components/common/Textarea/Textarea";
import { HealthEvent } from "@/types/petData";
import { nutritionSchema } from "@/components/modals/AddEventModal/schema/nutrition";
import { useAppSelector } from "@/redux/hooks";
import darkX from "../../../../public/images/icons/dark-close.svg";
import lightX from "../../../../public/images/icons/close.svg";

type EditEventModalProps = {
  setIsOpenModal: (i: HealthEvent | null) => void;
  // eslint-disable-next-line
  handleUpdate: (i: any) => void;
  events: HealthEvent[];
  event: HealthEvent;
  type: "health" | "activity" | "nutrition";
};

const EditEventModal: React.FC<EditEventModalProps> = ({
  setIsOpenModal,
  handleUpdate,
  events,
  type,
  event,
}) => {
  const currentSchema = type === "nutrition" ? nutritionSchema : schema;
  const currentDefaultValues =
    type === "nutrition"
      ? { description: event.description || "" }
      : {
          date: event.date || "",
          description: event.description || "",
        };
  const { theme } = useAppSelector((state) => state.theme);
  const x = theme === "dark" ? darkX : lightX;
  const methods = useForm({
    resolver: yupResolver(currentSchema),
    //@ts-ignore
    defaultValues: currentDefaultValues,
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;
  const handleCloseModal = () => {
    setIsOpenModal(null);
  };
  const onSubmit = async (payload: HealthEvent) => {
    const updatedEventsList = events.map((i) => {
      if (i.id === event.id) return { ...i, ...payload };
      else return i;
    });
    await handleUpdate({ [`${type}_events`]: updatedEventsList });
    await handleCloseModal();
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseModal();
        }}
        className="z-[10000000] fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 h-[100%] w-[100%] bg-opacity-45 bg-black"
      >
        <div className="overflow-hidden relative sm:w-[70%] w-full  max-w-[600px]  py-6 rounded-2xl bg-white dark:bg-sidebar-bg">
          <button
            onClick={handleCloseModal}
            className="absolute sm:right-[32px] z-[10000000] right-[24px] top-[24px] text-brown-500 font-semibold text-base leading-[11px] mb-4"
          >
            <Image
              src={x}
              alt={"Close"}
              width={24}
              height={24}
              className={"h-[24px] w-[24px]"}
            />
          </button>
          <div className={"px-8 flex flex-col  justify-between"}>
            <h2 className=" font-700 leading-136% sm:text-28px text-20px mb-[20px] dark:text-white text-dark-gray-text">
              Edit Event
            </h2>
            <div className="w-full border-input-border dark:border-input-border-dark border-[0.5px] border-solid" />

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {type !== "nutrition" && (
                  <div className="min-w-[50%]">
                    <p className="text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]">
                      Date
                    </p>
                    {/* @ts-ignore */}
                    <Calendar
                      name={"date"}
                      errorMessage={errors?.date?.message || ""}
                      control={control}
                    />
                  </div>
                )}
                <div className="min-w-[50%]">
                  <p className="text-dark-gray-text dark:text-white font-400 leading-136% text-16px my-[20px]">
                    Description
                  </p>
                  <Textarea
                    placeholder="Description"
                    errorMessage={errors?.description?.message || ""}
                    {...register("description")}
                  />
                </div>
                <div className="mt-[30px] w-[200px] mx-[auto]">
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
      </div>
    </>
  );
};

export default EditEventModal;
