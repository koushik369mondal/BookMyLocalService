import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { pageVariants } from "../utils/motion";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}