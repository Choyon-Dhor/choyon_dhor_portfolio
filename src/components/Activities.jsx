import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiAward, FiUsers, FiHeart } from "react-icons/fi";

const activities = [
  {
    title: "Campus Coordinator – YUNet",
    description:
      "Leading campus-wide skill development programs, organizing workshops, and driving student engagement in innovation initiatives.",
    icon: FiUsers,
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Cultural Secretary – MU CSE Society",
    description:
      "Led planning and execution of national-level tech and cultural festivals, managing teams, logistics, and cross-club collaborations.",
    icon: FiUsers,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Campus Ambassador – Bdapps (Robi)",
    description:
      "Promoted mobile app development initiatives, conducted workshops, and engaged students in Bangladesh’s largest app ecosystem.",
    icon: FiAward,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Assistant – Centre for Strategy and Policy Innovation (CSPI)",
    description:
      "Contributed to research discussions, policy analysis, and strategic planning initiatives within a professional think-tank environment.",
    icon: FiAward,
    color: "from-green-500 to-emerald-500",
  }
];

const Activities = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section id="activities" className="relative py-28 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-neon-purple-light tracking-widest uppercase">
            #activities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            Leadership & <span className="neon-gradient-text">Involvement</span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-neon-purple-light via-neon-purple to-neon-purple-dark mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Activities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {activities.map((act, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative overflow-hidden"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-dark-blue/80 to-deep-charcoal/80 backdrop-blur-sm rounded-2xl border border-neon-purple/10 group-hover:border-neon-purple/30 transition-all duration-300" />

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-transparent rounded-2xl" />
              </div>

              <div className="relative p-6 md:p-8">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${act.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <act.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white group-hover:text-neon-purple-light transition-colors mb-2">
                  {act.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {act.description}
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 text-neon-purple-light opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-2">
                  <FiArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${act.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Activities;
