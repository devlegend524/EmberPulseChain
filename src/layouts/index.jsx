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
      <div className="fixed -top-[10%] left-[65%] -z-20  rounded-full h-[500px] w-[500px] bg-[#160e23] blur-3xl"></div>
      <div className="fixed -bottom-[85%] -left-[20%] -z-20  rounded-full h-[1400px] w-[1200px] bg-[#180f0dbd] blur-3xl"></div>
    </div>
  );
}