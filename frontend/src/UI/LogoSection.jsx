import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const LogoSection = () => (
  <Link to="/" className="flex items-center gap-2 mb-8">
    <motion.img
      src={Logo}
      alt="Logo"
      className="h-12 w-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05, rotate: 2 }}
    />
  </Link>
);

export default LogoSection;
