import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavLinks = ({ navItems, onClick }) => (
  <nav className="flex flex-col gap-4 text-base font-medium">
    {navItems.map(({ to, icon: Icon, label }, i) => (
      <motion.div
        key={to}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
        whileHover={{ scale: 1.05, x: 5 }}
      >
        <Link
          to={to}
          onClick={onClick}
          className="flex items-center gap-3 p-2 rounded-lg hover:text-emerald-500 transition"
        >
          <Icon size={22} />
          <span>{label}</span>
        </Link>
      </motion.div>
    ))}
  </nav>
);

export default NavLinks;
