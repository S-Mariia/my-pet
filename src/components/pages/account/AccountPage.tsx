"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLoading } from "@/redux/slices/loading/loadingSlice";
import { setUser } from "@/redux/slices/userAuth/userAuthSlice";
import { supabase } from "@/supabase/supabase-client";
import { showSuccessToast } from "@/utils/tostify";

import InfoSideHeader from "@/components/common/InfoSideHeader/InfoSideHeader";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";

import userDark from "../../../../public/images/icons/user-dark.svg";
import userIcon from "../../../../public/images/icons/user.svg";
import updateIcon from "../../../../public/images/icons/update.svg";
import plus from "../../../../public/images/icons/plusb-white.svg";

export default function AccountPage() {
  const { theme } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const userImg = theme === "dark" ? userDark : userIcon;

  useEffect(() => {
    if (!user) return;

    setEmail(user.email || "");
    setAvatarUrl(user.photoURL || "");

    if (user.displayName) {
      const names = user.displayName.split(" ");
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");
    } else {
      setFirstName("");
      setLastName("");
    }
  }, [user]);

  const handleUpdateUser = async (avatarPath?: string) => {
    if (!user) return;

    try {
      dispatch(setLoading(true));

      const fullName = `${firstName} ${lastName}`.trim();
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          avatar_url: avatarPath || avatarUrl,
        })
        .eq("id", user.uid);

      if (error) throw error;

      dispatch(
        setUser({
          ...user,
          displayName: fullName,
          photoURL: avatarPath || avatarUrl,
        })
      );

      showSuccessToast("Account has been successfully updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setAvatar(null);
      setPreview("");
      setIsUpdate(false);
      dispatch(setLoading(false));
    }
  };

  const uploadAvatar = async () => {
    if (!avatar || !user) return;

    try {
      dispatch(setLoading(true));

      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("userId", user.uid);

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);

      await handleUpdateUser(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <InfoSideHeader title="Your account" />
      <div className="mt-[50px] flex gap-[20px] sm:flex-row flex-col items-center sm:items-start">
        <div className="relative">
          <div className="relative sm:mr-[35px] bg-light-bg-md dark:bg-dark-gray-bg rounded-full p-[15px] shadow">
            <div className="relative h-[120px] w-[120px] max-h-[120px] max-w-[120px]">
              <Image
                src={avatarUrl || userImg}
                alt="user"
                width={120}
                height={120}
                className="w-full h-full object-cover rounded-full"
              />

              {isUpdate && (
                <div className="absolute top-0 h-[120px] w-[120px] flex items-center justify-center dark:bg-sidebar-bg-04 bg-black-bg-04 rounded-full border-[1.5px] border-solid border-circle-border">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="preview"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Image src={plus} alt="add new" width={35} height={35} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute top-0 left-0 h-[120px] w-[120px] opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAvatar(file);
                      if (file?.type.startsWith("image")) {
                        const reader = new FileReader();
                        reader.onload = (ev) =>
                          setPreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {!isUpdate && (
            <button
              className="absolute top-[100px] right-0"
              onClick={() => setIsUpdate(true)}
            >
              <Image src={updateIcon} alt="update" width={40} height={40} />
            </button>
          )}
        </div>

        <div className="flex flex-col w-full gap-[20px]">
          <div className="w-full sm:max-w-[400px]">
            <p className="mb-[10px] text-dark-gray-text dark:text-white font-400 leading-136% text-16px">
              First Name
            </p>
            <CustomInput
              type="text"
              value={firstName}
              placeholder="First Name"
              setValue={setFirstName}
              disabled={!isUpdate}
            />
          </div>

          <div className="w-full sm:max-w-[400px]">
            <p className="mb-[10px] text-dark-gray-text dark:text-white font-400 leading-136% text-16px">
              Last Name
            </p>
            <CustomInput
              type="text"
              value={lastName}
              placeholder="Last Name"
              setValue={setLastName}
              disabled={!isUpdate}
            />
          </div>

          <div className="w-full sm:max-w-[400px]">
            <p className="mb-[10px] text-dark-gray-text dark:text-white font-400 leading-136% text-16px">
              Email
            </p>
            <CustomInput
              type="email"
              value={email}
              placeholder="Email"
              setValue={setEmail}
              disabled
            />
          </div>

          {isUpdate && (
            <div className="flex w-full flex-col-reverse sm:flex-row sm:max-w-[400px] items-center gap-[10px]">
              <CustomButton
                type="button"
                title="Cancel"
                onClick={() => setIsUpdate(false)}
              />
              <CustomButton
                type="button"
                title="Update my account"
                onClick={async () =>
                  avatar ? await uploadAvatar() : await handleUpdateUser()
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
