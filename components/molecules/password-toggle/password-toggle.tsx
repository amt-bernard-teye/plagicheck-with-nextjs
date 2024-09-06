import EyeSlash from "@/components/atoms/icons/eye-slash";
import Eye from "@/components/atoms/icons/eye";

type PasswordToggleProps = {
  state: boolean;
  onToggle: () => void;
}

export default function PasswordToggle({state, onToggle}: PasswordToggleProps) {
  return (
    <button style={{
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      lineHeight: "0.5",
    }} type="button" onClick={onToggle}>
      {state
        ? <EyeSlash />
        : <Eye /> }
    </button>
  );
}