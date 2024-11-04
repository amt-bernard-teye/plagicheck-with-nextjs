import ArrowLeft from "@/components/atoms/icons/arrow-left";

export type GoBackProps = {
  onReturn: () => void;
}

export default function GoBack({onReturn}: GoBackProps) {
  return (
    <div className="inline-block">
      <button className="flex gap-2 items-center text-[1.2em] cursor-pointer font-semibold" onClick={onReturn}>
        <ArrowLeft /> Back
      </button>
    </div>
  );
}