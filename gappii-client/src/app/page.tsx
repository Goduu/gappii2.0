"use client"
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import LogoText from './home/LogoText';
import { DotPattern } from '@/components/magicui/dot-pattern';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      // Reset after 5 seconds to allow new submissions
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-50 to-white dark:from-midnight-950 dark:to-midnight-900 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.05]" />

      {/* Beta access banner */}
      <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-midnight-600 to-midnight-800 text-white py-2 px-4 text-center text-sm md:text-base flex items-center justify-center">
        <span className="inline-block animate-pulse bg-white/20 text-white text-xs rounded-full px-2 py-0.5 mr-2">BETA</span>
        Limited spots available for early access –&nbsp; <span className='underline cursor-pointer' onClick={() => { inputRef.current?.focus() }}>Sign up now!</span>
      </div>
      <LogoText />

      {/* Hero section */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-20 md:pb-32 mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8 md:gap-12 pt-18">

          {/* Main headline with typing effect */}
          <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-midnight-100 dark:bg-midnight-900/30 text-midnight-600 dark:text-midnight-300 text-xs sm:text-sm font-medium mb-2"
            >
              <span className="flex h-2 w-2 mr-2">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-midnight-400 dark:bg-midnight-500 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-midnight-500 dark:bg-midnight-400"></span>
              </span>
              Join 2,149 early users in our beta program
            </motion.div>

            <TypingHeadline />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-midnight-600 dark:text-midnight-400"
            >
              <span className="font-medium">Struggling to learn new subjects efficiently?</span> Gappii uses
              AI to create <span className="underline decoration-midnight-400 decoration-2 underline-offset-2">personalized learning paths</span> that adapt to how you learn best.
            </motion.p>

            {/* Beta signup form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5 }}
              className="max-w-md mx-auto w-full mt-4 sm:mt-6"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-grow">
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || isSubscribed}
                    className={cn(
                      "w-full px-4 h-12 sm:h-14 rounded-lg border-2 shadow-sm bg-white dark:bg-midnight-800 text-midnight-900 dark:text-white outline-none transition duration-200",
                      error ? "border-red-500" : "border-midnight-200 dark:border-midnight-700 focus:border-midnight-500 dark:focus:border-midnight-500",
                      "placeholder:text-midnight-400 dark:placeholder:text-midnight-500"
                    )}
                  />
                  {error && <p className="absolute -bottom-6 left-0 text-red-500 text-xs">{error}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || isSubscribed}
                  className={cn(
                    "h-12 sm:h-14 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center min-w-[140px] transition-all",
                    isSubscribed
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-midnight-600 to-midnight-800 hover:from-midnight-500 hover:to-midnight-700 text-white shadow-md hover:shadow-lg"
                  )}
                >
                  {isSubmitting ? (
                    <SpinnerIcon className="w-5 h-5 text-white" />
                  ) : isSubscribed ? (
                    "You're in! ✓"
                  ) : (
                    "Get Early Access"
                  )}
                </motion.button>
              </form>
              <p className="text-xs text-midnight-500 dark:text-midnight-400 mt-2 text-center">
                🔒 No credit card required. Get free access in our beta trial.
              </p>
            </motion.div>

            {/* Testimonial mini carousel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.8 }}
              className="max-w-sm mx-auto mt-4 sm:mt-6 px-6 py-4 bg-white/50 dark:bg-midnight-800/30 backdrop-blur-sm rounded-lg shadow-sm border border-midnight-200 dark:border-midnight-800"
            >
              <TestimonialCarousel />
            </motion.div>
          </div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mt-8 md:mt-12"
          >
            <FeatureCard
              icon="✨"
              title="Personalized Learning"
              description="AI adapts to your unique learning style and pace"
              mobileVisible={true}
            />
            <FeatureCard
              icon="🧠"
              title="Smart Repetition"
              description="Remember more with scientifically proven techniques"
              mobileVisible={false}
            />
            <FeatureCard
              icon="🔍"
              title="Progress Insights"
              description="See your improvement with detailed analytics"
              mobileVisible={false}
            />
          </motion.div>

          {/* Interactive beam - mobile optimized */}

        </div>
      </main>
      <div className="w-screen max-w-4xl mt-8 md:mt-12 hidden sm:block relative h-36">
        <GridBeam className="h-[120px] sm:h-[180px] md:h-[200px]">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight-700 dark:from-midnight-700 to-transparent h-24 z-10" />
        </GridBeam>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 sm:py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center border-t border-midnight-200 dark:border-midnight-800 text-center bg-gradient-to-b from-midnight-900 to-midnight-950 overflow-hidden">
        <p className="text-xs sm:text-sm text-white dark:text-white mb-2 sm:mb-0">
          Limited beta access. By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
        <a
          className="flex items-center hover:underline text-white dark:text-white text-xs sm:text-sm"
          href="https://github.com/Goduu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Goduu © {new Date().getFullYear()}
        </a>
      </footer>
    </div >
  );
}

// Spinner icon for loading state
const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Testimonial carousel
const TestimonialCarousel = () => {
  const testimonials = [
    {
      id: 1,
      text: "Gappii helped me learn Python in half the time it would normally take!",
      author: "Sofia K.",
      role: "Product Designer",
    },
    {
      id: 2,
      text: "The personalized approach is amazing. It's like having a tutor that knows exactly how I learn.",
      author: "Marcus T.",
      role: "Marketing Specialist",
    },
    {
      id: 3,
      text: "I've tried many learning apps, but Gappii's AI approach is revolutionary.",
      author: "Alex W.",
      role: "Software Engineer",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center">
        <div className="text-midnight-600 dark:text-midnight-400 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>
        <div
          className="transition-transform duration-700 ease-in-out transform"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 min-w-full"
              style={{ display: index === activeIndex ? 'block' : 'none' }}
            >
              <p className="text-midnight-700 dark:text-midnight-300 text-sm sm:text-base">{testimonial.text}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-midnight-900 dark:text-white">{testimonial.author}</span>
                <span className="mx-1 text-midnight-400">•</span>
                <span className="text-xs text-midnight-500 dark:text-midnight-400">{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-3 space-x-1">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-4 bg-midnight-500' : 'w-1.5 bg-midnight-300 dark:bg-midnight-600'
              }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Typing effect headline component
const TypingHeadline = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Transform how you learn with AI";
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    if (iteration < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.substring(0, iteration + 1));
        setIteration(iteration + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [fullText, iteration]);

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-midnight-500 to-midnight-700 dark:from-midnight-300 dark:to-midnight-500">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block ml-1 h-6 w-[2px] sm:h-8 sm:w-[3px] md:h-10 md:w-[4px] lg:h-12 lg:w-1 bg-midnight-500"
      />
    </h1>
  );
};

// Feature card component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  mobileVisible: boolean;
}

const FeatureCard = ({ icon, title, description, mobileVisible }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={cn(
        "rounded-xl p-4 sm:p-6 bg-white dark:bg-midnight-800/50 border border-midnight-200 dark:border-midnight-700 shadow-sm transition-all duration-300",
        !mobileVisible && "hidden md:block"
      )}
    >
      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{icon}</div>
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-midnight-900 dark:text-white">{title}</h3>
      <p className="text-sm sm:text-base text-midnight-600 dark:text-midnight-400">{description}</p>
    </motion.div>
  );
};

// Enhanced Grid Beam component
interface GridBeamProps {
  children: React.ReactNode;
  className?: string;
}

export const GridBeam = ({ children, className }: GridBeamProps) => (
  <div className={cn('relative h-full overflow-hidden w-screen', className)}>
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-midnight-900 to-midnight-950">
      <Beam />
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      {children}
    </motion.div>

  </div>
);

// Enhanced Beam Animation
export const Beam = () => {
  return (
    <svg
      width="356"
      height="163"
      viewBox="0 0 356 163"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 w-full h-full"
    >
      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />

      <path
        d="M31 .5h32M0 .5h32m30 31h32m-1 0h132m-1 31h32M62.5 32V0m62 163V31m50-31v80"
        stroke="url(#grad1)"
        strokeWidth={2}
      />
      <defs>
        <motion.linearGradient
          variants={{
            initial: {
              x1: '40%',
              x2: '50%',
              y1: '160%',
              y2: '180%'
            },
            animate: {
              x1: '0%',
              x2: '10%',
              y1: '-40%',
              y2: '-20%'
            }
          }}
          animate="animate"
          initial="initial"
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            repeatDelay: 1
          }}
          id="grad1"
        >
          <stop stopColor="#18CCFC" stopOpacity="0" />
          <stop stopColor="#18CCFC" />
          <stop offset="0.325" stopColor="#6344F5" />
          <stop offset="0.675" stopColor="#AE48FF" />
          <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};
