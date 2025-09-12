import { useTranslations } from "next-intl";
import styles from "./LoginForm.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ButtonComponent from "../button/ButtonComponent";
import loginUser from "@/app/lib/loginUser";
import "@/styles/globals.css";
import { useAuth } from "@/app/context/AuthContext";

interface LoginFormProps {
  setIsModalOpen: () => void;
  setFailedLogin: () => void;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm({
  setIsModalOpen,
  setFailedLogin,
}: LoginFormProps) {
  const route = useRouter();
  const t = useTranslations("Index");
  const { refreshAuth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    const response = await loginUser(data);

    if (response == null) {
      setFailedLogin();
      reset();
      return;
    }
    console.log("LOGIN RESPONSE:", response);

    localStorage.setItem("role", response.data.role);
    localStorage.setItem("username", response.data.username);

    await refreshAuth();

    if (response?.data?.role === "admin") {
      route.push("/admin/products");
    } else {
      route.push("/");
    }

    reset();
  };

  return (
    <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)}>
      <h3>{t("loginTitle")}</h3>
      <input
        type="text"
        placeholder="Email"
        {...register("email")}
        autoComplete="email"
      />
      {errors.email && (
        <p className={styles.error}>{`${errors.email.message}`}</p>
      )}
      <input
        type="password"
        placeholder={t("password")}
        {...register("password")}
        autoComplete="password"
      />
      {errors.password && (
        <p className={styles.error}>{`${errors.password.message}`}</p>
      )}
      <ButtonComponent variant="primary" isEnable={isSubmitting} color="black">
        <p>{t("login")}</p>
      </ButtonComponent>
      <p className={styles.create_account} onClick={setIsModalOpen}>
        {t("createNewAccount")}
      </p>
    </form>
  );
}
