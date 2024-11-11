"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
    };
  };

  const passwordStrength = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const isPasswordMatch = formData.password === formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    if (!isPasswordMatch) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Sign in after successful signup
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-12 w-12 mx-auto mb-4">
                <div className="w-full h-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Start Your Journey
              </CardTitle>
            </motion.div>
            <CardDescription className="text-gray-500">
              Create your account to begin your leadership development
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-700">
                    Password requirements:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "length", label: "8+ characters" },
                      { key: "number", label: "One number" },
                      { key: "special", label: "Special character" },
                      { key: "uppercase", label: "Uppercase letter" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`flex items-center space-x-2 ${
                          passwordStrength[key as keyof typeof passwordStrength]
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordStrength[
                          key as keyof typeof passwordStrength
                        ] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 border border-current rounded-full" />
                        )}
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isPasswordValid || !isPasswordMatch}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-600 w-full">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
