import Person from "@/components/atoms/icons/person";

type UserInfoProps = {
  image?: string | null;
  name: string;
}

export default function UserInfo({image, name}: UserInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 border border-[var(--gray-700)] rounded-full flex items-center justify-center bg-[var(--gray-600)]">
        <Person />
      </div>
      <span>{name}</span>
    </div>
  );
}