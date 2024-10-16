"use client";

import Image from "next/image";

import Person from "@/components/atoms/icons/person";

type ProfileProps = {
  name: string;
  email: string;
  image?: string;
}

export default function Profile({name, email, image}: ProfileProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 relative">
        {!image 
          ? <div className="border border-[var(--gray-700)] rounded-full w-[inherit] h-[inherit] flex items-center justify-center"><Person /></div>
          : <div className="w-full h-full overflow-hidden">
              <Image src={image} alt="User profile image" className="object-cover rounded-full w-full h-full" fill priority/>
            </div>
        }
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-[var(--success-100)] inline-block rounded-full border-2 border-white"></span>
      </div>
      <div>
        <h5 className="font-semibold">{ name }</h5>
        <p className="text-[0.875em]">{ email }</p>
      </div>
    </div>
  );
}