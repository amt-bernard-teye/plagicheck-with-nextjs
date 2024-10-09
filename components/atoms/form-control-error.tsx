type FormControlErrorProps = {
  errorMessage: string;
}

export default function FormControlError({errorMessage}: FormControlErrorProps) {
  return (
    <small className="text-[var(--error-100)]">{errorMessage}</small>
  );
}