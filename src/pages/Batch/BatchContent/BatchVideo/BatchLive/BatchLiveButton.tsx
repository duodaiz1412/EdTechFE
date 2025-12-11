interface BatchLiveButtonProps {
  isSwitch: boolean;
  state?: boolean;
  title: string;
  onClick?: () => void;
  switchIcon?: React.ReactNode[];
  icon?: React.ReactNode;
}

export default function BatchLiveButton({
  isSwitch,
  state,
  title,
  onClick,
  switchIcon,
  icon,
}: BatchLiveButtonProps) {
  return (
    <button
      className={`${
        state
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-gray-700 hover:bg-gray-600"
      } text-white p-4 rounded-full transition-all shadow-lg hover:scale-110`}
      onClick={onClick}
      title={title}
    >
      {isSwitch && state ? switchIcon?.[0] : switchIcon?.[1]}
      {!isSwitch && icon}
    </button>
  );
}
