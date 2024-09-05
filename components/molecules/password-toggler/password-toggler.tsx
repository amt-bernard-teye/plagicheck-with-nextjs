import EyeSlash from "@/components/atoms/icons/eye-slash";
import Eye from "@/components/atoms/icons/eye";

type PasswordTogglerProps = {
  state?: boolean;
  onToggle: () => void;
}

export default function PasswordToggler({state, onToggle: onClick}: PasswordTogglerProps) {
  return (
    <button style={{
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      lineHeight: "0.5",
    }} type="button" onClick={onClick}>
      {state 
        ? <EyeSlash />
        : <Eye /> }
    </button>
  );
}