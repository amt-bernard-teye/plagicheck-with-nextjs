import { ComponentPropsWithoutRef } from "react";

type FormGroupProps = ComponentPropsWithoutRef<"div">;

export default function FormGroup(props: FormGroupProps) {
  return (
    <div {...props}>
      { props.children }
    </div>
  );
}