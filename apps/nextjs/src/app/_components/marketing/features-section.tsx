"use client";

import { motion } from "framer-motion";
import { Brain, Mic, Shield, Zap, FileText, Users, BookOpen } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Passive Listening",
    description: "Vetskii listens to your consultations without interruption, capturing every important detail automatically.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: "Intelligent Insights",
    description: "Get instant, evidence-based recommendations tailored to each specific case and patient.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BookOpen,
    title: "Trained on Historical Cases",
    description: "Built on years of veterinary case data and clinical experience, providing reliable, field-tested guidance.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Zap,
    title: "Real-time Assistance",
    description: "Ask questions during consultations and receive immediate, accurate answers from your intelligent assistant.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: FileText,
    title: "Automated Documentation",
    description: "Generate comprehensive consultation notes and treatment plans automatically.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and secure. We prioritize patient privacy and GDPR compliance.",
    color: "from-indigo-500 to-purple-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function FeaturesSection() {
  return (
    <section className="relative py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4 md:text-5xl">
            Powerful Features for Modern Veterinarians
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Vetskii combines advanced technology with veterinary expertise to enhance your practice
            and improve patient outcomes.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="group relative"
              >
                <div className="relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                       style={{
                         background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                       }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}