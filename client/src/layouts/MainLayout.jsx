import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Backdrop } from "../components/ui/Backdrop";
import { pageVariants } from "../utils/motion";

export default function MainLayout({ children }) {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-200">
      <Backdrop />
      <Navbar />
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="relative z-10 flex-1"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}