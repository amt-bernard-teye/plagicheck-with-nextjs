import { useState } from "react";

export function useSubmitting() {
  const [formSubmissionState, setFormSubmissionState] = useState<"pending" | "submitting" | "done">("pending");
  return { formSubmissionState, setFormSubmissionState};
}