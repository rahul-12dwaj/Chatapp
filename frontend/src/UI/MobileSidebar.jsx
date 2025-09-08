import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import NavLinks from "./NavLinks";
import ProfileSection from "./ProfileSection";

const MobileSidebar = ({ isOpen, setIsOpen, navItems, handleLogout }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-black shadow-lg z-50 flex flex-col justify-between"
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-white">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="p-4">
          <NavLinks navItems={navItems} onClick={() => setIsOpen(false)} />
        </div>

        {/* Bottom Profile */}
        <div className="p-4 border-t">
          <ProfileSection handleLogout={handleLogout} />
        </div>
      </motion.aside>
    )}
  </AnimatePresence>
);

export default MobileSidebar;
