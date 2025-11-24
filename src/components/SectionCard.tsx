import {ReactNode} from "react";
import {Heading3} from "@/components/Typography";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const SectionCard = ({title, children, className}: SectionCardProps) => {
  return (
    <div
      className={`bg-white border rounded-lg shadow-sm p-6 space-y-6 ${
        className || ""
      }`.trim()}
    >
      <Heading3>{title}</Heading3>
      {children}
    </div>
  );
};

export default SectionCard;
