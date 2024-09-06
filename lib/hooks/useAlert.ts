import { useState } from "react";
import { AlertVariant } from "../enums/alert-variant";

export function useAlert() {
  const [alertDetails, setAlertDetails] = useState<{
    message: string;
    variant: AlertVariant
  }>({message: "", variant: AlertVariant.SUCCESS});
  let timer: NodeJS.Timeout;

  function handleAlertDetails(message: string, variant: AlertVariant) {
    setAlertDetails({
      message,
      variant
    });

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      setAlertDetails({
        message: "",
        variant: AlertVariant.SUCCESS
      });
    }, 3000);
  }

  return {alertDetails, handleAlertDetails};
}