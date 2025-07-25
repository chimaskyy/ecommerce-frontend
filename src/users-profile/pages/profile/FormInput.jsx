// components/FormInput.js
import {
  FaRegEnvelope,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaCity,
} from "react-icons/fa";
import { HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useState } from "react";

const iconMap = {
  email: <FaRegEnvelope className="text-primary text-xl" />,
  user: <FaUser className="text-primary text-xl" />,
  phone: <FaPhone className="text-primary text-xl" />,
  address: <FaMapMarkerAlt className="text-primary text-xl" />,
  home: <FaHome className="text-primary text-xl" />,
  city: <FaCity className="text-primary text-xl" />,
  password: <HiOutlineLockClosed className="text-primary text-xl" />,
};

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon = "user",
  required = false,
  showToggle = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5">
      <label className="flex items-center gap-1 text-sm font-bold text-neutral-900 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded">
        <div className="w-14 h-14 flex justify-center items-center border-r border-gray-200">
          {iconMap[icon]}
        </div>
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 h-14 px-4 bg-transparent focus:outline-none"
          required={required}
          disabled={disabled}
        />
        {showToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="px-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
