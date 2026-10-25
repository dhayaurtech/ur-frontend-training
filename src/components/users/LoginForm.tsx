"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";
import { apiClient, ApiError } from "@/lib/api-client";
import { X } from "lucide-react";

const loginSchema = z.object({
    email:z.string().trim().min(1,"Email is required").email("Invalid email"),
    password:z.string().trim().min(4,"Password must be atleast 4 characters long")
})

type LoginFormData = z.infer<typeof loginSchema>;

type LoginResponse = {
  accessToken:string;
  user:{
    name:string;
    email:string;
  }
}

const messages = [
  "Welcome to ShopDesk.",
  "Explore different varieties of products.",
  "Manage your inventory with ease.",
];

export default function LoginForm() {
  const router = useRouter();

  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("")

  useEffect(() => {
    const currentMessage = messages[messageIndex];

    const timer = setTimeout(
      () => {
        if (!deleting && displayText === currentMessage) {
          setDeleting(true);
        } else if (deleting && displayText === "") {
          setDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        } else {
          setDisplayText(
            currentMessage.slice(
              0,
              displayText.length + (deleting ? -1 : 1)
            )
          );
        }
      },
      !deleting && displayText === currentMessage ? 1800 : deleting ? 30 : 65
    );

    return () => clearTimeout(timer);
  }, [displayText, deleting, messageIndex]);

const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<LoginFormData>({resolver:zodResolver(loginSchema),mode:'onTouched'});

const onSubmit = async(data:LoginFormData) => {
  try {
    const result = await apiClient.post<LoginResponse>('/auth/login',data);

    console.log("Login successful : ",result.user);
    router.push('/')
  } catch (error) {
    if(error instanceof Error){
      setError(error.message)
    }

    console.error("Login failed");
  }
}

  return (
    <main className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Left side */}
      <section className="relative flex min-h-[380px] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-950 via-violet-800 to-purple-600 px-7 py-8 text-white sm:px-12 sm:py-10 lg:min-h-screen lg:w-1/2 lg:px-16 lg:py-14">
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-black text-violet-800 shadow-lg">
            S
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Shop<span className="text-violet-300">Desk</span>
          </span>
        </div>

        {/* Animated text */}
        <div className="relative z-10 my-12 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            Your shopping workspace
          </span>

          <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
            Discover more.
            <br />
            <span className="text-violet-300">Manage smarter.</span>
          </h1>

          <div className="mt-7 min-h-20 text-lg leading-8 text-violet-100 sm:text-xl">
            <p>{displayText}</p>
            <span className="mt-1 inline-block h-6 w-0.5 animate-pulse bg-violet-200" />
          </div>

          {/* Feature highlights */}
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              Product discovery
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              Easy inventory
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              Simple management
            </span>
          </div>
        </div>

        <p className="relative z-10 text-xs text-violet-200/70">
          © 2026 ShopDesk. All rights reserved.
        </p>
      </section>

      {/* Right side */}
      <section className="flex w-full items-center justify-center bg-violet-100 px-6 py-12 sm:px-12 lg:min-h-screen lg:w-1/2 lg:bg-white lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              Welcome back
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Sign in to ShopDesk
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your details to continue to your dashboard.
            </p>
          </div>
          {error && <div className="bg-red-500 border-4 border-red-600 text-white p-2 my-5 rounded-2xl flex justify-between shadow-2xl shadow-zinc-500">{error} <X className="cursor-pointer hover:zoom-90" onClick={() => setError("")}/></div>}
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <Input id="email" {...register('email')} />
              {errors.email && <p className="text-red-500 font-mono">{errors.email.message}</p>}

            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-semibold text-violet-600 transition hover:text-violet-800"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} {...register('password')} />


                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-4 text-xs font-semibold text-violet-600 hover:text-violet-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
              {errors.password && <p className="text-red-500 font-mono">{errors.password.message}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-violet-600 focus:ring-violet-500"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-200 active:translate-y-0"
            >
              Sign in
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium tracking-widest text-gray-400">
              SHOP SMARTER
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-xs leading-6 text-gray-500">
            Secure access to your ShopDesk workspace.
          </p>
        </div>
      </section>
    </main>
  );
}
