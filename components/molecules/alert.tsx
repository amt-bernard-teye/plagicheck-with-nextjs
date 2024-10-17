"use client";

import CheckCircle from "../atoms/icons/check-circle";
import CloseCircle from "../atoms/icons/close-circle";
import CloseButton from "../atoms/close-button";

type AlertProps = {
  variant: "success" | "error",
  message: string;
}

export default function Alert({variant, message}: AlertProps) {
  let alertClass = "fixed top-12 left-[50%] translate-x-[-50%] bg-white flex items-center w-[95%] md:w-[554px] justify-between py-2 px-4 rounded-md shadow border z-20 ";

  if (variant === "success") {
    alertClass += "border-[#00e600]";
  }
  else {
    alertClass += "border-[#FF0000]";
  }

  return (
    <div className={alertClass}>
      <div className="flex gap-2">
        {variant === "success" ? <CheckCircle /> : <CloseCircle /> }
        <p className={variant === "success" ? "text-[#00e600]" : "text-[#FF0000]"}>{ message }</p>
      </div>
      <CloseButton />
    </div>
  );
}