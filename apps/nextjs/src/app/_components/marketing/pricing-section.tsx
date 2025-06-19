"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Building } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: 79,
    period: "month",
    description: "Perfect for individual veterinarians or small practices",
    features: [
      "Up to 100 consultations/month",
      "Basic intelligent assistance",
      "Automated note-taking",
      "Email support",
      "GDPR compliant storage",
      "Mobile app access",
    ],
    cta: "Join Beta",
    popular: false,
  },
  {
    name: "Professional",
    icon: Crown,
    price: 239,
    period: "month",
    description: "Ideal for busy practices and specialist clinics",
    features: [
      "Unlimited consultations",
      "Advanced intelligent insights",
      "Custom protocols",
      "Real-time transcription",
      "Priority support",
      "Team collaboration tools",
      "Advanced analytics",
      "Integration with practice management",
    ],
    cta: "Join Beta",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building,
    price: "Custom",
    period: "",
    description: "For large practices and veterinary groups",
    features: [
      "Everything in Professional",
      "White-label solution",
      "Custom integrations",
      "Dedicated account manager",
      "On-site training",
      "Custom model training",
      "99.9% uptime SLA",
      "Advanced security features",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function PricingSection() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4 md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Join our beta program and help shape the future of veterinary technology.
          </p>
          
          {/* Beta badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <span className="text-sm font-medium">🚀 Currently in beta testing</span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                variants={item}
                className="group relative"
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 text-black text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`relative h-full p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'bg-white/10 border-lime-400/30 hover:border-lime-400/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}>
                  {/* Icon */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-lime-400 to-emerald-400' 
                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                    }`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      {typeof plan.price === 'number' ? (
                        <>
                          <span className="text-3xl font-bold text-white">A${plan.price}</span>
                          <span className="text-white/60">/{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/auth/login" className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-black hover:shadow-lg hover:shadow-lime-400/25'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </Link>

                  {/* Gradient background on hover */}
                  {plan.popular && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold text-white mb-2">What is beta testing?</h4>
              <p className="text-white/70 text-sm">Beta testing allows early access to Vetskii while we refine features based on real-world feedback.</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold text-white mb-2">How long is the beta?</h4>
              <p className="text-white/70 text-sm">Beta participants get exclusive access and preferential pricing when we launch publicly.</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold text-white mb-2">Is my data secure?</h4>
              <p className="text-white/70 text-sm">Yes. We're GDPR compliant with enterprise-grade security and encryption.</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold text-white mb-2">Do you offer training?</h4>
              <p className="text-white/70 text-sm">We provide comprehensive onboarding and ongoing support for all plans.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}