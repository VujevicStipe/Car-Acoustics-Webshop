"use client";
import { useTranslations } from "next-intl";
import styles from "./RegistrationForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonComponent from "../button/ButtonComponent";
import registerUser from "@/app/lib/registerUser";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface RegistrationFormProps {
  setSuccessful: (value: boolean) => void;
  setError: (value: boolean) => void;
}

const registerSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  setSuccessful,
  setError,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const t = useTranslations("Index");
  const [passwordInputVisible, setPasswordInputVisible] = useState(false);
  const [repeatPasswordInputVisible, setRepeatPasswordInputVisible] =
    useState(false);

  const onSubmit: SubmitHandler<{
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
  }> = async (data) => {
    const userData = {
      ...data,
      role: "user",
    };

    const response = await registerUser(userData);
    if (!response) {
      setSuccessful(false);
      setError(true);
      return;
    }

    setSuccessful(true);
    setError(false);
    reset();
  };

  return (
    <form className={styles.register_form} onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder={t("username")}
        {...register("username")}
        autoComplete="username"
        className={styles.inputField}
      />
      {errors.username && (
        <p className={styles.error}>{`${errors.username.message}`}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        autoComplete="email"
        className={styles.inputField}
      />
      {errors.email && (
        <p className={styles.error}>{`${errors.email.message}`}</p>
      )}

      <div className={styles.password_input}>
        <input
          type={passwordInputVisible ? "text" : "password"}
          placeholder={t("password")}
          {...register("password")}
          autoComplete="new-password"
          className={styles.inputField}
        />
        <div
          className={styles.password_input__icon}
          onClick={() => setPasswordInputVisible(!passwordInputVisible)}
        >
          {passwordInputVisible ? (
            <VisibilityOff style={{ color: "#555" }} />
          ) : (
            <Visibility style={{ color: "#555" }} />
          )}
        </div>
      </div>
      {errors.password && (
        <p className={styles.error}>{`${errors.password.message}`}</p>
      )}

      <div className={styles.repeat_password_input}>
        <input
          type={repeatPasswordInputVisible ? "text" : "password"}
          placeholder={t("repeatPassword")}
          {...register("repeatPassword")}
          autoComplete="new-password"
          className={styles.inputField}
        />
        <div
          className={styles.repeat_password_input__icon}
          onClick={() =>
            setRepeatPasswordInputVisible(!repeatPasswordInputVisible)
          }
        >
          {repeatPasswordInputVisible ? (
            <VisibilityOff style={{ color: "#555" }} />
          ) : (
            <Visibility style={{ color: "#555" }} />
          )}
        </div>
      </div>
      {errors.repeatPassword && (
        <p className={styles.error}>{`${errors.repeatPassword.message}`}</p>
      )}

      <ButtonComponent variant="primary" color="black" isEnable={isSubmitting}>
        <p>{t("register")}</p>
      </ButtonComponent>
    </form>
  );
};

export default RegistrationForm;
