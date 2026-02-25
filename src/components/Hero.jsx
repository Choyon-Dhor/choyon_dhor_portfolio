import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import profilePic from "../assets/choyon dhor.png";

// TypingEffect Component
const TypingEffect = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < text.length) {
            setCurrentText(text.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(text.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    isDeleting,
    currentTextIndex,
    texts,
    speed,
    deleteSpeed,
    pauseTime,
  ]);

  return <span className="typing-cursor inline-block">{currentText}</span>;
};

// NeuralNetworkBackground Component
const NeuralNetworkBackground = () => {
  const nodes = [
    { x: 20, y: 20 },
    { x: 50, y: 30 },
    { x: 80, y: 20 },
    { x: 30, y: 50 },
    { x: 70, y: 50 },
    { x: 20, y: 80 },
    { x: 50, y: 70 },
    { x: 80, y: 80 },
  ];

  const connections = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 5],
    [3, 6],
    [4, 6],
    [4, 7],
    [5, 6],
    [6, 7],
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Connections */}
      {connections.map(([start, end], i) => (
        <motion.line
          key={`connection-${i}`}
          x1={`${nodes[start].x}%`}
          y1={`${nodes[start].y}%`}
          x2={`${nodes[end].x}%`}
          y2={`${nodes[end].y}%`}
          stroke="url(#neonGradient)"
          strokeWidth="1"
          className="neural-line"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r="3"
          fill="#c084fc"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            delay: i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
};

// FloatingParticle Component
const FloatingParticle = ({ index }) => {
  const randomDelay = Math.random() * 5;
  const randomDuration = 15 + Math.random() * 10;
  const randomX = Math.random() * 100;
  const randomSize = 2 + Math.random() * 3;

  return (
    <motion.div
      className="absolute rounded-full bg-neon-purple-light"
      style={{
        width: randomSize,
        height: randomSize,
        left: `${randomX}%`,
        opacity: 0.1 + Math.random() * 0.2,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, 30, 0],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// GeometricShapes Component
const GeometricShapes = () => {
  return (
    <>
      {/* Hexagon */}
      <motion.div
        className="absolute top-20 right-20 w-16 h-16 opacity-10"
        style={{
          border: "1px solid rgba(168, 85, 247, 0.5)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none"
            stroke="rgba(168, 85, 247, 0.5)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Circle outline */}
      <motion.div
        className="absolute bottom-32 left-16 w-12 h-12 opacity-10"
        style={{
          border: "1px solid rgba(168, 85, 247, 0.5)",
          borderRadius: "50%",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Triangle */}
      <motion.div
        className="absolute top-1/3 left-10 w-10 h-10 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 90,90 10,90"
            fill="none"
            stroke="rgba(168, 85, 247, 0.5)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </>
  );
};

// Main Hero Component
const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const backgroundX = useTransform(x, [-100, 100], [10, -10]);
  const backgroundY = useTransform(y, [-100, 100], [10, -10]);
  const textX = useTransform(x, [-100, 100], [-5, 5]);
  const textY = useTransform(y, [-100, 100], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = clientX - window.innerWidth / 2;
      const yPos = clientY - window.innerHeight / 2;
      setMousePosition({ x: xPos, y: yPos });
      x.set(xPos);
      y.set(yPos);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  const handleContactClick = () => {
    const contactSection = document.getElementById("contacts");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback: scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-deep-charcoal"
    >
      {/* Background Layers */}
      <motion.div
        className="absolute inset-0 hero-grid"
        style={{ x: backgroundX, y: backgroundY }}
      />

      {/* Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>

      {/* Geometric Shapes */}
      <GeometricShapes />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            className="order-2 lg:order-1"
            style={{ x: textX, y: textY }}
          >
            {/* 1. Small Intro Line */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4 font-medium"
            >
              Hello, I'm
            </motion.p>

            {/* 2. Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]">
                <span className="text-white">Choyon is a</span>
                <br />
                <span className="neon-gradient-text text-glow-purple">
                  CSE Student
                </span>
                <br />
                <span className="text-white">and</span>
                <br />
                <span className="neon-gradient-text text-glow-purple">
                  Machine Learning & AI
                </span>
                <span className="text-white"> Enthusiast</span>
              </h1>
            </motion.div>

            {/* Typing Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-lg sm:text-xl text-neon-purple-light font-medium">
                <TypingEffect
                  texts={[
                    "ML Researcher",
                    "AI Explorer",
                    "Problem Solver",
                    "Web Developer",
                    "Data Structure & Algorithm"
                  ]}
                  speed={80}
                  deleteSpeed={40}
                  pauseTime={1000}
                />
              </p>
            </motion.div>

            {/* 3. Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-gray-400 text-base sm:text-lg max-w-xl mb-8 leading-relaxed"
            >
              I build intelligent systems and research-driven web applications
              with structured logic, scalable architecture, and clean design.
            </motion.p>

            {/* 4. CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {/* Primary Button - Contact Me */}
              <motion.button
                onClick={handleContactClick}
                className="relative px-8 py-3 border border-neon-purple text-neon-purple-light font-medium overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-purple-light via-neon-purple to-neon-purple-dark opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative">Contact Me</span>
              </motion.button>
              {/* Secondary Button - Download CV */}
              
              <motion.a
                href="https://drive.google.com/uc?export=download&id=1VKOvOCDBXVIL9ajYOMd0dy8Mg-xzuSyl"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-8 py-3 glass-purple text-neon-purple-light font-medium group inline-block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 rounded-inherit border border-neon-purple/30 group-hover:border-neon-purple/60 transition-colors duration-300" />
                <span className="relative flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download CV
                </span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Section - Image & Visual Elements */}
          <motion.div
            className="order-1 lg:order-2 relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ x: useTransform(x, [-100, 100], [5, -5]) }}
          >
            {/* Separator Line (Desktop only) */}
            <div
              className="hidden lg:block absolute left-0 top-0 bottom-0 separator-line"
              style={{ left: "-3rem" }}
            />

            {/* Image Container */}
            <div className="relative">
              {/* Neural Network Background */}
              <div className="absolute inset-0 w-72 h-72 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px]">
                <NeuralNetworkBackground />
              </div>

              {/* Glow behind image */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Profile Image */}
              <motion.div
                className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] animate-float"
                style={{ zIndex: 10 }}
              >
                <img
                  src={profilePic}
                  alt="Choyon Dhor"
                  className="w-full h-full object-cover rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    boxShadow: "0 0 60px rgba(168, 85, 247, 0.3)",
                  }}
                />

                {/* Decorative corners */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-neon-purple/50" />
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-neon-purple/50" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-neon-purple/50" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-neon-purple/50" />
              </motion.div>

              {/* Badge */}
              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 glass-purple px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <span className="w-2 h-2 rounded-full bg-neon-purple animate-badge-pulse" />
                <span className="text-sm text-neon-purple-light">
                  Currently working on ML Research & Web Projects
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }}
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            Scroll
          </span>
          <motion.div className="w-6 h-10 border border-gray-600 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-neon-purple rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
