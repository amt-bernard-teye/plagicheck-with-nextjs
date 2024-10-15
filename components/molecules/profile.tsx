"use client";

import Image from "next/image";

import Person from "@/components/atoms/icons/person";
import profileImage from "@/public/profile.jpg";

type ProfileProps = {
  name: string;
  email: string;
}

export default function Profile({name, email}: ProfileProps) {
  let hasImage = false;
  
  return (
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 relative">
        {!hasImage 
          ? <div className="border border-[var(--gray-700)] rounded-full w-[inherit] h-[inherit] flex items-center justify-center"><Person /></div>
          : <Image src={profileImage} alt="User profile image" className="w-[100%] h-[100%] object-cover rounded-full"/>
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