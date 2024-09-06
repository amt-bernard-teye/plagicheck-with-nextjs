type InputErrorProps = {
  message?: string;
}

export default function InputError({message}: InputErrorProps) {
  return (
    <small style={{
      color: "var(--error-100)"
    }}>{ message }</small>
  );
}