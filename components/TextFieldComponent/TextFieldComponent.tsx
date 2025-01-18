import React, { FC, forwardRef, ReactNode, useCallback, useMemo } from "react";
import styles from "./TextField.module.css";

export enum AdornmentPosition {
  Start = "start",
  End = "end",
}

interface WithFlexWrapperProps {
  enabled: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const WithFlexWrapper: FC<WithFlexWrapperProps> = ({
  enabled,
  fullWidth,
  children,
}) => {
  if (!enabled) return <>{children}</>;

  return (
    <div
      className={`${styles.flexWrapper} ${fullWidth ? styles.fullWidth : ""}`}
    >
      {children}
    </div>
  );
};

interface SideButtonProps {
  customComponent?: React.ReactNode;
  text: string;
  onClick: () => void;
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  disabled?: boolean;
}

interface TextFieldProps {
  label?: string;
  name?: string;
  value?: string | number;
  errorText?: string;
  type?: string;
  onBlur?: (
    event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onChange: (
    value: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onEnterPress?: () => void;
  setFieldTouched?: (name: string, isTouched: boolean) => void;
  autocapitalize?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  adornmentPosition?: AdornmentPosition;
  adornment?: string | JSX.Element;
  readOnly?: boolean;
  focused?: boolean;
  placeholder?: string;
  helperText?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
  buttonProps?: SideButtonProps;
  inputRef?: React.Ref<HTMLInputElement>;
  dataAttr?: string;
}

// eslint-disable-next-line react/display-name
export const TextFieldComponent = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      name,
      value,
      errorText,
      type = "text",
      setFieldTouched,
      onChange,
      onEnterPress,
      onBlur = () => ({}),
      autocapitalize = false,
      disabled = false,
      fullWidth = false,
      readOnly = false,
      focused = false,
      adornmentPosition = AdornmentPosition.Start,
      adornment,
      placeholder,
      helperText,
      multiline,
      rows,
      className,
      buttonProps,
      inputRef,
      dataAttr,
    },
    ref
  ) => {
    const showSideButton = !!buttonProps;

    const sideButtonAdornment = useCallback(() => {
      if (!showSideButton || !buttonProps) return <></>;

      return (
        <div className={styles.sideButtonAdornment}>
          {buttonProps.customComponent || (
            <button
              onClick={buttonProps.onClick}
              className={styles.sideButton}
              style={{
                width: buttonProps.width || "auto",
                height: buttonProps.height || "40px",
              }}
              disabled={buttonProps.disabled}
            >
              <span
                className={styles.sideButtonText}
                style={{
                  fontSize: buttonProps.fontSize || "14px",
                  fontWeight: buttonProps.fontWeight || "600",
                }}
              >
                {buttonProps.text}
              </span>
            </button>
          )}
        </div>
      );
    }, [buttonProps, showSideButton]);

    const AdornmentBlock = useMemo(() => {
      const key =
        adornmentPosition === AdornmentPosition.Start
          ? "startAdornment"
          : "endAdornment";

      const adornmentValue = adornment
        ? {
            [key]: (
              <div
                className={
                  adornmentPosition === AdornmentPosition.Start
                    ? styles.startAdornment
                    : styles.endAdornment
                }
              >
                {adornment}
              </div>
            ),
            readOnly,
          }
        : { readOnly };

      if (showSideButton) {
        adornmentValue.endAdornment = sideButtonAdornment();
      }

      return adornmentValue;
    }, [
      adornment,
      adornmentPosition,
      readOnly,
      showSideButton,
      sideButtonAdornment,
    ]);

    const autoCompleteOnPassword = useMemo(
      () =>
        type === "password"
          ? {
              autoComplete: "new-password",
            }
          : {},
      [type]
    );

    const labelValue = useMemo(
      () => (helperText ? "" : errorText || label),
      [errorText, label, helperText]
    );

    const onBlurHandler = (
      event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      if (setFieldTouched && name) {
        setFieldTouched(name, true);
      }
      onBlur(event);
    };

    const onChangeHandler = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (autocapitalize && e.target.value.length === 1) {
          e.target.value = e.target.value.toUpperCase();
        }
        onChange?.(e);
      },
      [autocapitalize, onChange]
    );

    return (
      <WithFlexWrapper enabled={!!buttonProps} fullWidth={fullWidth}>
        <div
          className={`${styles.textFieldWrapper} ${className || ""} ${
            disabled ? styles.disabled : ""
          }`}
        >
          {label && <label className={styles.label}>{labelValue}</label>}
          <input
            disabled={disabled}
            name={name}
            value={value}
            type={type}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            placeholder={placeholder}
            className={styles.textField}
            readOnly={readOnly}
            autoComplete={type === "password" ? "new-password" : undefined}
            ref={ref || inputRef}
            data-attr={dataAttr}
            onKeyDown={(key) => {
              if (key.code === "Enter") {
                onEnterPress?.();
              }
            }}
          />
          {AdornmentBlock.endAdornment && (
            <div className={styles.endAdornmentWrapper}>
              {AdornmentBlock.endAdornment}
            </div>
          )}
          {helperText && errorText && (
            <div className={styles.helperText}>{errorText}</div>
          )}
        </div>
      </WithFlexWrapper>
    );
  }
);

export default TextFieldComponent;
