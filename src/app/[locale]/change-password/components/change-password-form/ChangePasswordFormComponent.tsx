"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import styles from "./ChangePasswordFormComponent.module.css";
import { z } from "zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ButtonComponent from "@/app/[locale]/components/button/ButtonComponent";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordFormComponent() {
  const [form, setForm] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordForm, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      if (value.length > 0 && value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          newPassword: "Password must be at least 8 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, newPassword: undefined }));
      }
    }
    if (name === "confirmPassword" || name === "newPassword") {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ChangePasswordForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as keyof ChangePasswordForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Password changed successfully!");
        router.push("/user-page");
      } else {
        const error = await res.json();
        if (
          error.message &&
          error.message.toLowerCase().includes("current password")
        ) {
          setErrors((prev) => ({
            ...prev,
            currentPassword: error.message,
          }));
        } else {
          toast.error(error.message || "Failed to change password.");
        }
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.changePasswordForm}
      autoComplete="off"
    >
      <label>
        Current Password
        <div className={styles.inputWithIcon}>
          <input
            type={currentPasswordVisible ? "text" : "password"}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className={styles.inputField}
          />
          <div
            className={styles.passwordInputIcon}
            onClick={() => setCurrentPasswordVisible((v) => !v)}
            tabIndex={0}
            role="button"
            aria-label={
              currentPasswordVisible ? "Hide password" : "Show password"
            }
          >
            {currentPasswordVisible ? (
              <VisibilityOff style={{ color: "#555" }} />
            ) : (
              <Visibility style={{ color: "#555" }} />
            )}
          </div>
          <div className="error">{errors.currentPassword || ""}</div>
        </div>
      </label>

      <label>
        New Password
        <div className={styles.inputWithIcon}>
          <input
            type={newPasswordVisible ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className={styles.inputField}
          />
          <div
            className={styles.passwordInputIcon}
            onClick={() => setNewPasswordVisible((v) => !v)}
            tabIndex={0}
            role="button"
            aria-label={newPasswordVisible ? "Hide password" : "Show password"}
          >
            {newPasswordVisible ? (
              <VisibilityOff style={{ color: "#555" }} />
            ) : (
              <Visibility style={{ color: "#555" }} />
            )}
          </div>
        </div>
        <div className="error">{errors.newPassword || ""}</div>
      </label>

      <label>
        Confirm New Password
        <div className={styles.inputWithIcon}>
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className={styles.inputField}
          />
          <div
            className={styles.passwordInputIcon}
            onClick={() => setConfirmPasswordVisible((v) => !v)}
            tabIndex={0}
            role="button"
            aria-label={
              confirmPasswordVisible ? "Hide password" : "Show password"
            }
          >
            {confirmPasswordVisible ? (
              <VisibilityOff style={{ color: "#555" }} />
            ) : (
              <Visibility style={{ color: "#555" }} />
            )}
          </div>
          <div className="error">{errors.confirmPassword || ""}</div>
        </div>
      </label>
      <ButtonComponent variant="primary" color="orange">
        {loading ? "Changing..." : "Change Password"}
      </ButtonComponent>
    </form>
  );
}
