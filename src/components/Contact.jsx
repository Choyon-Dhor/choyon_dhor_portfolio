import { motion } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const socialLinks = [
    {
      name: "Email",
      icon: FiMail,
      href: "mailto:choyondhorshuvo@gmail.com",
      label: "choyondhorshuvo@gmail.com",
      description: "Drop me an email",
    },
    {
      name: "GitHub",
      icon: FiGithub,
      href: "https://github.com/choyon-dhor",
      label: "@choyon-dhor",
      description: "Check my code",
    },
    {
      name: "LinkedIn",
      icon: FiLinkedin,
      href: "https://linkedin.com/in/choyondhor",
      label: "Choyondhor",
      description: "Let's connect",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section id="contacts" className="relative py-28 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-neon-purple-dark/5 rounded-full blur-[80px]" />

        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
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
            #contacts
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            Let&apos;s <span className="neon-gradient-text">Connect</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            I&apos;m open to academic collaborations, research discussions, and
            technology-based projects. Feel free to reach out!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-purple-light via-neon-purple to-neon-purple-dark mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Message */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Get in Touch
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Whether you have a question about research opportunities,
                collaboration ideas, or just want to say hi, I&apos;ll try my
                best to get back to you!
              </p>
            </motion.div>

            {/* Location */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 text-gray-400 mb-8"
            >
              <div className="w-10 h-10 glass-dark border border-neon-purple/20 rounded-lg flex items-center justify-center">
                <FiMapPin className="text-neon-purple-light" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Bangladesh</p>
                <p className="text-xs text-gray-500">
                  Available for remote work
                </p>
              </div>
            </motion.div>

            {/* Response time badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 glass-dark border border-neon-purple/20 px-4 py-2 rounded-full"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-badge-pulse" />
              <span className="text-sm text-gray-300">
                Usually responds within 24 hours
              </span>
            </motion.div>
          </motion.div>

          {/* Right - Contact Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-4"
          >
            {socialLinks.map((link, idx) => (
              <motion.div
                key={link.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                className="group"
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-dark border border-neon-purple/20 p-5 rounded-xl hover:border-neon-purple/50 hover:bg-neon-purple/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 glass-purple rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <link.icon className="w-6 h-6 text-neon-purple-light" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-neon-purple-light transition-colors">
                        {link.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {link.description}
                      </p>
                    </div>
                    <div className="text-neon-purple-light opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                      →
                    </div>
                  </div>
                  <div className="mt-3 ml-[4.5rem]">
                    <span className="text-sm font-mono text-neon-purple-light group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-4">Prefer a different way?</p>
          <motion.a
            href="https://wa.me/qr/HNLCEJTYX7VPN1"
            target="_blank"
            whileHover={{ scale: 1.20 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary text-lg px-8 py-3 inline-block"
          >
            <FaWhatsapp  className="inline mr-2" />
            Send a Message
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
