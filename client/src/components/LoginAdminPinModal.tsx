import { useRef, useState } from "react";
import { useLoginAdminMutation } from "../slices/adminApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { setAdminToken } from "@/slices/authSlice";
import { ErrorResponse } from "@/types";

const LoginAdminPinModal = ({
  closeAdminPinModal,
}: {
  closeAdminPinModal: () => void;
}) => {
  const [pin, setPin] = useState<string>(""); // State to store the 4-digit pin
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const dispatch: Dispatch = useDispatch();

  const [loginAdmin, { isLoading }] = useLoginAdminMutation(); // Mutation hook

  // Function to handle input change and move focus
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Only allow one digit (remove if any non-digit characters)
    if (/^\d$/.test(value)) {
      const newPin = pin.split("");
      newPin[index] = value;
      setPin(newPin.join(""));

      // Move to next input
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      e.target.value = ""; // Clear if it's not a digit
    }
  };

  // Function to handle key down (backspace to move focus backward)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1].focus(); // Move focus to the previous input
    }
  };

  // Function to handle login submission
  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await loginAdmin({ pin }).unwrap();
      toast.success(response.message);
      dispatch(setAdminToken(response.success));
      closeAdminPinModal(); // Close the admin pin modal on success
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="overlay fixed inset-0 z-10 bg-[rgba(12,27,77,0.15)]  backdrop-blur-[4px] transition-all duration-300"
      onClick={closeAdminPinModal} // Close when clicking outside
    >
      <form
        onSubmit={handleLogin}
        className="fixed-container z-20 flex-col w-[80%] opacity-100 transition-all duration-300 md:w-[40%]  rounded-md flex gap-6 lg:w-[30%] xl:w-[20%]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="input__container flex gap-4">
          {[...Array(4)].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el!)}
              type="password"
              maxLength={1} // Restrict the input to one character
              className="border w-full focus:outline focus:outline-[#1d3b72] focus:outline-1 h-[60px] rounded-lg border-[#1d3b72] p-4 text-center text-2xl" // Center text
              onChange={(e) => handleInputChange(e, index)} // Call the input change handler
              onKeyDown={(e) => handleKeyDown(e, index)} // Call the key down handler for backspace
            />
          ))}
        </div>
        <button
          className="text-lg rounded-lg font-bold mb-4 uppercase border border-white px-4 py-3 bg-[#0c1b4d] text-white hover:bg-[#09123a] transition-all duration-300 hover:border-white"
          onClick={handleLogin} // Call handleLogin on button click
          disabled={isLoading} // Disable while loading
        >
          {isLoading ? (
            <div className="flex p-2 items-center justify-center gap-3">
              <l-line-spinner
                size="16"
                stroke="3"
                speed="1"
                color="#fff"
              ></l-line-spinner>{" "}
            </div>
          ) : (
            "LOGIN"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginAdminPinModal;
