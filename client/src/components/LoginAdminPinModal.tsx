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
    index: number,
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
    index: number,
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
      className="overlay fixed inset-0 z-10 bg-[rgba(12,27,77,0.15)] backdrop-blur-[4px] transition-all duration-300"
      onClick={closeAdminPinModal} // Close when clicking outside
    >
      <form
        onSubmit={handleLogin}
        className="fixed-container z-20 flex w-[80%] flex-col gap-6 rounded-md opacity-100 transition-all duration-300 md:w-[40%] lg:w-[30%] xl:w-[20%]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="input__container flex gap-4">
          {[...Array(4)].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el!)}
              type="number"
              maxLength={1} // Restrict the input to one character
              className="h-[60px] w-full rounded-lg border border-[#1d3b72] p-4 text-center text-2xl focus:outline focus:outline-1 focus:outline-[#1d3b72]" // Center text
              onChange={(e) => handleInputChange(e, index)} // Call the input change handler
              onKeyDown={(e) => handleKeyDown(e, index)} // Call the key down handler for backspace
            />
          ))}
        </div>
        <button
          className="mb-4 rounded-lg border border-white bg-[#0c1b4d] px-4 py-3 text-lg font-bold uppercase text-white transition-all duration-300 hover:border-white hover:bg-[#09123a]"
          onClick={handleLogin} // Call handleLogin on button click
          disabled={isLoading} // Disable while loading
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-2">
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


