type AuthHeaderProps = {
  heading: string;
  description: string;
}

export default function AuthHeader({heading, description}: AuthHeaderProps) {
  return (
    <div>
      <h4 className="text-[1.2em] font-semibold mb-2">{heading}</h4>
      <p>{description}</p>
    </div>
  );
}