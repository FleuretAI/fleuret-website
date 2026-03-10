import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
}

const StaggerGroup = ({ children, className }: StaggerGroupProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default StaggerGroup;
