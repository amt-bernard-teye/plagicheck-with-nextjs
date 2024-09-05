import { ReactNode } from "react";

export default function FormGroup({children}: {children: ReactNode}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }}>
      { children }
    </div>
  );
}