"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function SignUpPage() {
  const { t, mounted } = useLocale();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("auth.signup.errors.fillAllFields"));
      return false;
    }

    if (formData.password.length < 6) {
      setError(t("auth.signup.errors.passwordTooShort"));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.signup.errors.passwordMismatch"));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("auth.signup.errors.invalidEmail"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name || null,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError(t("auth.signup.errors.emailAlreadyRegistered"));
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setSuccess(true);
      } else {
        // 이메일 확인이 필요없는 경우 또는 자동 로그인
        window.location.href = "/";
      }
    } catch (err) {
      setError(t("auth.signup.errors.signupError"));
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 클라이언트 마운트 전에는 스켈레톤 UI 표시
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mt-6"></div>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 animate-pulse">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("auth.signup.successTitle")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t("auth.signup.successMessage").replace("{email}", formData.email)}
                <br />
                {t("auth.signup.successMessage2")}
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-black hover:bg-gray-800">
                  {t("auth.signup.goToLogin")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workout Log</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            {t("auth.signup.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t("auth.signup.subtitle")}{" "}
            <Link href="/auth/login" className="text-black dark:text-white hover:underline">
              {t("auth.signup.loginLink")}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.signup.nameLabel")}
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("auth.signup.namePlaceholder")}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.signup.emailLabel")}
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("auth.signup.emailPlaceholder")}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.signup.passwordLabel")}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.signup.confirmPasswordLabel")}
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? t("auth.signup.signingUp") : t("auth.signup.signupButton")}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm">
                {t("auth.signup.backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}