import styles from "./SnackBarComponent.module.css";

interface SnackBarComponentProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: "successful" | "error";
}

const SnackBarComponent: React.FC<SnackBarComponentProps> = ({
  children,
  onClick,
  variant,
}) => {
  let snackBarStyle;
  switch (variant) {
    case "successful":
      snackBarStyle = styles.snack_bar_successful;
      break;
    case "error":
      snackBarStyle = styles.snack_bar_error;
      break;
    default:
      break;
  }

  return (
    <div className={`${styles.snack_bar} ${snackBarStyle}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default SnackBarComponent;
