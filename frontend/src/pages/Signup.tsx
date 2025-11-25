import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ErrorField } from "@/components/common/ErrorMessages";
import toast from "react-hot-toast";

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
}

export function SignupPage() {
  const { signup, isAuthLoading } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupForm>({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { fullName, email, password } = form;

    const res = await signup(fullName, email, password);

    if (res.success) {
      toast.success("User Registered");
      navigate("/");
    } else {
      console.log(res.errors);
      setErrors(res.errors);
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
              Create Your JobLytic Account
            </CardTitle>
            <p className="text-center text-sm text-gray-400 mt-1">
              Unlock personalized opportunities powered by AI.
            </p>
         
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-gray-100 pl-10"
                placeholder="Ajeet Kumar"
              />
            </div>

            <ErrorField messages={errors?.fullName} />
          </div>

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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
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

          <Button
            onClick={handleSubmit}
            disabled={isAuthLoading}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white"
          >
            {isAuthLoading ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-gray-200 underline cursor-pointer"
            >
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
