import { useRef } from "react";

import { FormSubmissionState } from "../enum/form-submission-state.enum";

export function useFormStateTimer(setFormState: (value: FormSubmissionState) => void) {
  const timerRef = useRef<NodeJS.Timeout>();

  function setAlertResolverTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setFormState(FormSubmissionState.PENDING);
    }, 2000);
  }
  
  return { setAlertResolverTimer };
}