import styles from "./ButtonComponent.module.css";

interface ButtonComponentProps {
  variant: "primary" | "secondary" | "tertiary";
  color: "white" | "black" | "orange" | "green" | "red" | "grey";
  children: React.ReactNode;
  onClick?: () => void;
  isEnable?: boolean;
  //variant: "authentication" | "add" | "profile" | "delete" | "reserve";
}

export default function ButtonComponent({
  variant,
  color,
  children,
  onClick,
  isEnable,
}: ButtonComponentProps) {
  const buttonClasses = [styles.button, styles[variant], styles[color]].join(
    " "
  );

  return (
    <button className={buttonClasses} disabled={isEnable} onClick={onClick}>
      {children}
    </button>
  );
}
