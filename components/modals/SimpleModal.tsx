import React, { FC, ReactNode } from "react";
import style from "./SimpleModal.module.css";

interface SimpleModalProps {
  open: boolean;
  handleClose: () => void;
  padding?: string;
  children: ReactNode;
}

const SimpleModal: FC<SimpleModalProps> = ({
  open,
  handleClose,
  padding,
  children,
}) => {
  if (!open) return null;

  return (
    <div className={style.modalOverlay} onClick={handleClose}>
      <div
        className={style.modalBox}
        style={{ padding }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default SimpleModal;
