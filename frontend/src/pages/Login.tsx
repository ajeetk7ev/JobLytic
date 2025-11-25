import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ErrorField } from "@/components/common/ErrorMessages";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login, isAuthLoading } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { email, password } = form;

    const res = await login(email, password);

    if (res.success) {
      toast.success("Logged In Successfully");
      navigate("/");
    } else {
      setErrors(res.errors || {});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="self-start w-8 h-8  justify-center  bg-gray-600 rounded-full  text-gray-300 hover:text-gray-100 flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          <CardTitle className="text-center text-gray-100 text-2xl font-bold">
            Welcome Back to JobLytic
          </CardTitle>
          <p className="text-center text-sm text-gray-400 mt-1">
            Log in to continue your career journey.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-gray-100 pl-10"
                placeholder="you@example.com"
              />
            </div>

            <ErrorField messages={errors?.email} />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-gray-100 pl-10 pr-12"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <ErrorField messages={errors?.password} />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <span className="text-sm text-gray-300 hover:text-gray-200 underline cursor-pointer">
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleSubmit}
            disabled={isAuthLoading}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white"
          >
            {isAuthLoading ? "Logging In..." : "Login"}
          </Button>

          {/* Sign Up Redirect */}
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link
              to={"/signup"}
              className="text-gray-200 underline cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
