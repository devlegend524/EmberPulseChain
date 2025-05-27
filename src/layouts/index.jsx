import { CircleBackground } from "components/CircleBackground";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { ParticleBackground } from "./ParticleBackground";
import { motion } from "framer-motion";

export default function index({ children }) {
  return (
    <div>
      <ParticleBackground />
      <Header />
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
      <div className="flex w-full justify-center min-h-[calc(100vh-70px)] pb-[100px] relative px-1">
        {children}
        <Footer />
      </div>
      </motion.div>
      <div className="hidden md:fixed -top-[10%] left-[65%] -z-20  rounded-full h-[500px] w-[500px] bg-[#170537] blur-3xl opacity-60"></div>
      <div className="hidden md:fixed -bottom-[85%] -left-[25%] -z-20  rounded-full h-[1200px] w-[1200px] bg-[#1c0803] blur-3xl opacity-40"></div>
    </div>
  );
}