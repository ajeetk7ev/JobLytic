
import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    credits: "5 Credits",
    features: ["5 AI Resume Scans", "Basic Resume Builder", "Limited Job Matches"],
    recommended: false,
    color: "bg-gray-800",
  },
  {
    id: "pro_monthly",
    name: "Pro Monthly",
    price: "$6", // Approx ₹499
    credits: "100 Credits/mo",
    features: [
      "100 AI Resume Scans",
      "Advanced Resume Builder",
      "Unlimited Job Matches",
      "Priority Support",
    ],
    recommended: true,
    color: "bg-primary",
  },
  {
    id: "pro_yearly",
    name: "Pro Yearly",
    price: "$60", // Approx ₹4999
    credits: "Unlimited",
    features: [
      "Unlimited AI Scans",
      "All Premium Templates",
      "Dedicated Career Coach",
      "Early Access to Features",
    ],
    recommended: false,
    color: "bg-indigo-600",
  },
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleBuy = async (planId: string) => {
    if (planId === "free") return;

    setLoading(true);
    try {
      // 1. Create Order
      const res = await api.post("/subscription/create-order", { planId });
      const { order, keyId } = res.data;

      // 2. Open Razorpay
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "JobLytic Pro",
        description: `Upgrade to ${planId}`,
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify Payment
          try {
            await api.post("/subscription/verify-payment", {
              ...response,
              planId,
            });
            toast.success("Upgrade Successful! Welcome to Pro.");
            // Ideally trigger a user re-fetch here
          } catch (err) {
            toast.error("Verification failed");
          }
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
      <div className="absolute top-0 center w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4"
        >
            <Star size={12} className="text-yellow-500" /> Upgrade your career
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">
          Choose your <span className="text-gradient">Superpower.</span>
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Unlock the full potential of AI resume matching and land your dream job faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-8 rounded-[2.5rem] bg-secondary/10 border border-white/5 flex flex-col ${plan.recommended ? 'ring-2 ring-primary shadow-2xl shadow-primary/20 scale-105' : ''}`}
          >
            {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-lg font-black uppercase tracking-wider text-muted-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">{plan.price}</span>
                    <span className="text-sm font-bold text-muted-foreground">/ month</span>
                </div>
                <div className="mt-4 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 inline-block text-xs font-bold text-primary">
                    {plan.credits}
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-gray-300">
                        <Check size={18} className="text-emerald-500 shrink-0" />
                        {feat}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => handleBuy(plan.id)}
                disabled={loading || plan.id === "free"}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                    plan.id === "free" 
                    ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed' 
                    : 'bg-foreground text-background hover:bg-white/90 shadow-lg hover:shadow-xl'
                }`}
            >
                {loading && plan.id !== "free" ? "Processing..." : plan.id === "free" ? "Current Plan" : "Get Started"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
