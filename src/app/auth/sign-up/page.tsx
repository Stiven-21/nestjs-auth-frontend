"use client";

import AuthNavbar from "@/components/layout/AuthNavbar";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaFacebookF,
  FaGithub,
  FaGoogle,
  FaInfoCircle,
  FaLock,
  FaLongArrowAltRight,
  FaUserAlt,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import { HiMiniIdentification } from "react-icons/hi2";
import Step from "@/components/steps/step";
import Link from "next/link";
import { SignUpForm } from "@/interfaces/forms/signUpForm";
import { API_URL } from "@/common/constants/api.constant";
import { findAllIdentityTypes } from "@/services/document/get.service";
import { SelectData } from "@/interfaces/select";
import { signUp } from "@/services/auth/auth-post.service";
import { ApiError } from "@/interfaces/api.interface";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [documentTypeOptions, setDocumentTypeOptions] = useState<SelectData[]>(
    [],
  );
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    mode: "onTouched",
  });

  useEffect(() => {
    const getIdentityType = async () => {
      const { data: identityTypes } = await findAllIdentityTypes();
      if (!identityTypes) return;
      setDocumentTypeOptions(
        identityTypes.map((identityType) => ({
          name: identityType.name,
          id: identityType.id,
        })),
      );
    };
    getIdentityType();
  }, []);

  const stepOptions = [
    {
      label: "1",
      description: "Personal information",
      isNavegable: !loadingSubmit,
      onClick: (step: number) => setStep(step),
      error: !!(
        errors.name ||
        errors.lastname ||
        errors.documentTypeId ||
        errors.document
      ),
    },
    {
      label: "2",
      description: "Account information",
      isNavegable: !loadingSubmit,
      onClick: (step: number) => setStep(step),
      error: !!(errors.email || errors.password),
    },
    {
      label: "3",
      description: "Confirmation",
      isNavegable: !loadingSubmit,
      onClick: (step: number) => setStep(step),
      error: !!(
        errors.name ||
        errors.lastname ||
        errors.documentTypeId ||
        errors.document ||
        errors.email ||
        errors.password
      ),
    },
  ];

  const handleAvatarChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) return;
    setStep(step + 1);
    setShowPassword(false);
  };

  const handlePreviousStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) return;
    setStep(step - 1);
    setShowPassword(false);
  };

  const handleOAuthLogin = (provider: string) => {
    setLoadingSubmit(true);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signUp(data);
      if (response.meta && response.meta.action === "SUCCESS_REGISTER") {
        alert(
          "Registrado con exito en la fecha " +
            new Date(response.meta.createdAt as string).toLocaleDateString(),
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const errors = error.message.split("|");
        errors.forEach((error) => {
          alert(error);
        });
        // console.error(error.code, error.message);
        // error.details → errores de validación
      }
    }
  });

  const name = useWatch({ control, name: "name" });
  const lastname = useWatch({ control, name: "lastname" });
  const documentTypeId = useWatch({ control, name: "documentTypeId" });
  const document = useWatch({ control, name: "document" });
  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen relative flex items-start justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-xl px-6">
          <Step
            steps={stepOptions}
            curretStep={step}
          />
          <div className="bg-white mt-6 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/40 rounded-2xl p-8">
            <form
              className="space-y-6 flex flex-col"
              onSubmit={onSubmit}
            >
              {/* Step 1 */}
              <article
                className={`flex-1 space-y-6 ${step === 0 ? "block" : "hidden"}`}
              >
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Please provide your legal information details
                  </span>
                </div>

                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-700">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <span className="text-slate-400 text-sm text-center px-4">
                          Upload Photo
                        </span>
                      )}
                    </div>

                    <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
                      <RiImageAddFill className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        // {...register("avatar")}
                        onChange={(e) => handleAvatarChange(e.target.files)}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    JPG or PNG (Max 2MB)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2  gap-x-4">
                  {/* Name */}
                  <div className="mb-5 md:mb-0">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <FaUserAlt className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                      <input
                        autoFocus
                        type="text"
                        {...register("name")}
                        required
                        placeholder="e.g. Jhon"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Last Name (optional)
                    </label>
                    <div className="relative">
                      <FaUserAlt className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                      <input
                        type="text"
                        {...register("lastname")}
                        required
                        placeholder="e.g. Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Select document */}
                <div className="relative">
                  <Select
                    name="documentTypeId"
                    label="Tipo de documento"
                    labelRequired
                    register={register}
                    error={errors.documentTypeId?.message as string}
                    options={{
                      required: "El tipo de documento es obligatorio",
                    }}
                    setValue={setValue}
                    data={documentTypeOptions}
                    placeholder="Select a document"
                    isOpenable
                    watch={watch}
                    Icon={HiMiniIdentification}
                  />
                </div>

                {/* Document number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Document
                  </label>
                  <div className="relative">
                    <HiMiniIdentification className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      {...register("document")}
                      required
                      placeholder="e.g. 12345678"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
                    />
                  </div>
                </div>
              </article>

              {/* Step 2 */}
              <article
                className={`flex-1 space-y-6 ${step === 1 ? "block" : "hidden"}`}
              >
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">Account information</h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    We need this information to create your account
                  </span>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      {...register("email")}
                      required
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-start mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••"
                      required
                      className="w-full mb-1 pl-10 pr-10 py-3 placeholder:tracking-widest tracking-wider rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition"
                    />
                    <div className="absolute right-3 top-4">
                      {showPassword ? (
                        <FaEyeSlash
                          className=" w-5.5 h-5.5 text-slate-400 dark:text-slate-500 cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <FaEye
                          className=" w-5 h-5 text-slate-400 dark:text-slate-500 cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </article>

              {/* Step 3 */}
              <article
                className={`flex-1 space-y-6 ${step === 2 ? "block" : "hidden"}`}
              >
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    Confirm your information
                  </h2>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Please confirm your information
                  </span>
                </div>

                <div className="space-y-6 select-none ">
                  {/* Full name */}
                  <div>
                    <h4 className="text-xs font-semibold text-blue-500">
                      FULL NAME
                    </h4>

                    {!name ? (
                      <h6 className="text-red-400 dark:text-red-500 text-xs italic">
                        {" "}
                        Incomplete information{" "}
                      </h6>
                    ) : (
                      <h6 className="text-slate-950 dark:text-slate-100 text-xl italic">
                        {name} {lastname}
                      </h6>
                    )}

                    <div className="flex-1 h-px bg-blue-200 dark:bg-blue-500 opacity-40 dark:opacity-10 mt-2" />
                  </div>

                  {/* Type and number document */}
                  <div>
                    <h4 className="text-xs font-semibold text-blue-500">
                      TYPE AND NUMBER DOCUMENT
                    </h4>

                    {!documentTypeId || !document ? (
                      <h6 className="text-red-400 dark:text-red-500 text-xs italic">
                        {" "}
                        Incomplete information{" "}
                      </h6>
                    ) : (
                      <h6 className="text-slate-950 dark:text-slate-100 text-xl italic">
                        {
                          documentTypeOptions.find(
                            (i) => i.id === documentTypeId,
                          )?.name
                        }{" "}
                        {document}
                      </h6>
                    )}

                    <div className="flex-1 h-px bg-blue-200 dark:bg-blue-500 opacity-40 dark:opacity-10 mt-2" />
                  </div>

                  {/* Email */}
                  <div>
                    <h4 className="text-xs font-semibold text-blue-500">
                      EMAIL
                    </h4>

                    {!email ? (
                      <h6 className="text-red-400 dark:text-red-500 text-xs italic">
                        {" "}
                        Incomplete information{" "}
                      </h6>
                    ) : (
                      <h6 className="text-slate-950 dark:text-slate-100 text-xl italic">
                        {email}
                      </h6>
                    )}

                    <div className="flex-1 h-px bg-blue-200 dark:bg-blue-500 opacity-40 dark:opacity-10 mt-2" />
                  </div>

                  {/* Password */}
                  <div>
                    <h4 className="text-xs font-semibold text-blue-500">
                      PASSWORD
                    </h4>

                    {!password ? (
                      <h6 className="text-red-400 dark:text-red-500 text-xs italic">
                        {" "}
                        Incomplete information{" "}
                      </h6>
                    ) : (
                      <h6 className="text-slate-950 dark:text-slate-100 text-xl italic flex items-center justify-between tracking-widest">
                        {showPassword ? password : "●●●●●●●●"}
                        {showPassword ? (
                          <FaEyeSlash
                            className=" w-5.5 h-5.5 text-slate-400 dark:text-slate-500 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <FaEye
                            className=" w-5 h-5 text-slate-400 dark:text-slate-500 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </h6>
                    )}

                    <div className="flex-1 h-px bg-blue-200 dark:bg-blue-500 opacity-40 dark:opacity-10 mt-2" />
                  </div>

                  {/* Information confirmation */}
                  <div className="border border-blue-600 dark:border-blue-400/10 bg-blue-500/5 rounded-md p-4 flex items-center gap-x-3">
                    <span>
                      <FaInfoCircle className="h-5 w-5 text-blue-400 dark:text-blue-500" />
                    </span>
                    <span>
                      By clicking &quot;accept and continue&quot;, you declare
                      that the information provided is truthful and you accept
                      our terms and conditions of service.
                    </span>
                  </div>
                </div>
              </article>

              <article className="w-full grid grid-cols-2 gap-x-4">
                <button
                  className={`${
                    step === 0
                      ? "cursor-not-allowed text-slate-400 bg-slate-200 dark:bg-slate-700 opacity-50"
                      : "cursor-pointer text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 "
                  } px-4 py-2  rounded-lg flex items-center justify-center gap-x-2`}
                  onClick={handlePreviousStep}
                  type="button"
                  disabled={step === 0 || loadingSubmit}
                >
                  <FaChevronLeft className="h-4 w-auto " />
                  <p className="hidden md:block">Previous</p>
                </button>
                {step === stepOptions.length - 1 ? (
                  <button
                    className={` ${loadingSubmit || !name || !email || !password || !documentTypeId || !document ? "cursor-not-allowed text-slate-400 bg-slate-200 dark:bg-slate-700 opacity-50" : "cursor-pointer hover:gap-x-4 text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 "} px-4 py-2 rounded-lg flex items-center justify-center gap-x-2 ease-in-out duration-300`}
                    type="submit"
                    disabled={
                      loadingSubmit ||
                      !name ||
                      !email ||
                      !password ||
                      !documentTypeId ||
                      !document
                    }
                  >
                    <p className="hidden md:block">Accept and continue</p>
                    <FaLongArrowAltRight className="h-3.5 w-auto mt-1" />
                  </button>
                ) : (
                  <button
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-x-2"
                    onClick={handleNextStep}
                    type="button"
                  >
                    <p className="hidden md:block">Next</p>
                    <FaChevronRight className="h-3.5 w-auto" />
                  </button>
                )}
              </article>
            </form>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 dark:text-slate-500">
              OR REGISTER WITH
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Oauth */}
          <div className="bg-white my-6 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/40 rounded-2xl p-8">
            <div className="grid grid-cols-3 gap-x-4">
              <button
                onClick={() => handleOAuthLogin("google")}
                disabled={!!loadingSubmit}
                className="py-3 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 border cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <FaGoogle className="w-5 h-5 mr-2" />
                <span className="sr-only lg:not-sr-only">Google</span>
              </button>
              <button
                onClick={() => handleOAuthLogin("github")}
                disabled={!!loadingSubmit}
                className="py-3 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 border cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                <span className="sr-only lg:not-sr-only">GitHub</span>
              </button>
              <button
                onClick={() => handleOAuthLogin("facebook")}
                disabled={!!loadingSubmit}
                className="py-3 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 border cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <FaFacebookF className="w-5 h-5 mr-2" />
                <span className="sr-only lg:not-sr-only">Facebook</span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
              You already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <div className="flex space-x-8 items-center justify-center mb-3">
              <Link
                href="#"
                className="text-blue-600 dark:text-blue-400 font-medium opacity-70 hover:opacity-90"
              >
                Privacy Policy
              </Link>
              {/* <span>•</span> */}
              <Link
                href="#"
                className="text-blue-600 dark:text-blue-400 font-medium opacity-70 hover:opacity-90"
              >
                Temrs of Service
              </Link>
              {/* <span>•</span> */}
              <Link
                href="#"
                className="text-blue-600 dark:text-blue-400 font-medium opacity-70 hover:opacity-90"
              >
                Help Center
              </Link>
            </div>
            <span className="text-xs text-slate-200 dark:text-slate-700 pb-5">
              SECURE ENCRYPTED BY FINANCE
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
