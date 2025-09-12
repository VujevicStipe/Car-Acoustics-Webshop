import { useEffect, useRef } from "react";
import styles from "./DialogComponent.module.css";

interface DialogComponentProps {
  children: React.ReactNode;
  closeDialog?: () => void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  children,
  closeDialog,
}) => {
  const dialogref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    const handleOutsideClick = (event: any) => {
      if (!closeDialog) return null;
      if (dialogref.current && !dialogref.current.contains(event.target)) {
        closeDialog();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.addEventListener("mousedown", handleOutsideClick);
      document.body.style.overflowY = "auto";
    };
  }, []);

  return (
    <div className={styles.dialog}>
      <div ref={dialogref} className={styles.dialog_box}>
        {children}
      </div>
    </div>
  );
};

export default DialogComponent;
