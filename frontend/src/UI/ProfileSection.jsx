import { Link } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

const ProfileSection = ({ handleLogout }) => {
  // Get user data from Redux
  const { username, name, avatar } = useSelector((state) => state.currentUser);

  // Fallbacks if no user is loaded
  const displayName = name || "User";
  const userNameHandle = username || "username";
  const profilePic = avatar || "https://i.pravatar.cc/100";

  return (
    <div className="flex flex-col items-center justify-between rounded-xl bg-black transition">
      <div className="flex items-center gap-3">
        <img
          src={profilePic}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{displayName}</span>
          <span className="text-xs text-gray-500">@{userNameHandle}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to="/settings"
          className="p-2 hover:text-emerald-500 rounded-full transition"
        >
          <Settings size={18} />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full transition cursor-pointer hover:text-red-500"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
