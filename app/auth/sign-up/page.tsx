import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-svh w-full flex">
      {/* LEFT — FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10  bg-white/60  ">
        <div className="w-full max-w-sm  ">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Join Douala Toit</h1>
          <p className="text-gray-600 mb-6">
            Sign up to discover premium real estate listings in Douala. Find your dream home, get exclusive offers, and stay updated with the latest properties.
          </p>

          <SignUpForm />
        </div>
      </div>

      {/* RIGHT — IMAGE WITH GLASS TEXT */}
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="/images/man.png"
          alt="Sign up background"
          fill
          className="object-cover"
        />

        {/* Top Glass Text */}
        <div className="absolute top-4 left-10 right-10 max-w-[90%] p-6 rounded-xl bg-white/30 backdrop-blur-md border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-2">
            Find Your Dream Home
          </h2>
          <p className="text-white text-lg">
            Premium properties in Douala, just a click away.
          </p>
        </div>

        {/* Bottom Glass Text */}
        <div className="absolute bottom-0 left-10 right-10 max-w-[90%] p-6 rounded-xl bg-white/30 backdrop-blur-md border border-white/20">
          <p className="text-white text-lg">
            Browse premium properties in Douala and get exclusive offers today. Explore modern <span className="font-semibold">apartments</span>, luxurious <span className="font-semibold">villas</span>, and prime <span className="font-semibold">commercial spaces</span>. Stay ahead with the latest listings, property insights, </p>
        </div>
      </div>
    </div>
  );
}
