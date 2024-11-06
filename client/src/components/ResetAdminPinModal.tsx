import { useRef, useState } from "react";
import {
  useLogoutAdminMutation,
  useResetPinMutation,
} from "../slices/adminApiSlice";
import { toast } from "react-toastify";
import { ErrorResponse } from "@/types";
import { useDispatch } from "react-redux";
import { logout } from "@/slices/authSlice";

const ResetAdminPinModal = ({
  closeResetPinModal,
}: {
  closeResetPinModal: () => void;
}) => {
  const [oldPin, setOldPin] = useState<string>(""); // State to store the old pin
  const [newPin, setNewPin] = useState<string>(""); // State to store the new pin
  const oldPinRefs = useRef<HTMLInputElement[]>([]);
  const newPinRefs = useRef<HTMLInputElement[]>([]);

  const [resetPin, { isLoading }] = useResetPinMutation(); // Mutation hook

  const [logoutAdmin] = useLogoutAdminMutation();
  const dispatch = useDispatch();

  // Function to handle input change and move focus (shared for both old and new pins)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    isOldPin: boolean,
  ) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const pinArray = isOldPin ? oldPin.split("") : newPin.split("");
      pinArray[index] = value;

      isOldPin ? setOldPin(pinArray.join("")) : setNewPin(pinArray.join(""));

      // Move to next input
      if (index < (isOldPin ? oldPinRefs : newPinRefs).current.length - 1) {
        (isOldPin ? oldPinRefs : newPinRefs).current[index + 1].focus();
      }
    } else {
      e.target.value = "";
    }
  };

  // Function to handle key down (backspace to move focus backward)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    isOldPin: boolean,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      (isOldPin ? oldPinRefs : newPinRefs).current[index - 1].focus();
    }
  };

  // Function to handle reset PIN submission
  const handleResetPin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      // Reset the PIN
      const response = await resetPin({ oldPin, newPin }).unwrap();
      toast.success(response.message);

      // Log the admin out after successful PIN reset
      await logoutAdmin({}).unwrap();
      dispatch(logout());

      // Close the reset PIN modal
      closeResetPinModal();
    } catch (error) {
      // Handle any errors during the reset or logout process
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
      onClick={closeResetPinModal}
    >
      <form
        onSubmit={handleResetPin}
        className="fixed-container z-20 flex w-[80%] flex-col gap-6 rounded-md opacity-100 transition-all duration-300 lg:w-[30%] xl:w-[20%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3
            className="mb-4 text-lg font-bold uppercase text-[#0c1b4d]"
            style={{
              textShadow:
                "1px 1px 2px #fff, -1px -1px 2px #fff, 1px -1px 2px #fff, -1px 1px 2px #fff",
            }}
          >
            Enter Old PIN
          </h3>
          <div className="input__container flex gap-4">
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                ref={(el) => (oldPinRefs.current[index] = el!)}
                type="password"
                maxLength={1}
                className="h-[60px] w-full rounded-lg border border-blue-500 p-4 text-center text-2xl focus:outline focus:outline-1 focus:outline-blue-400"
                onChange={(e) => handleInputChange(e, index, true)} // Handle input for old pin
                onKeyDown={(e) => handleKeyDown(e, index, true)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3
            className="mb-4 text-lg font-bold uppercase text-[#0c1b4d]"
            style={{
              textShadow:
                "1px 1px 2px #fff, -1px -1px 2px #fff, 1px -1px 2px #fff, -1px 1px 2px #fff",
            }}
          >
            Enter Old PIN
          </h3>
          <div className="input__container flex gap-4">
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                ref={(el) => (newPinRefs.current[index] = el!)}
                type="password"
                maxLength={1}
                className="h-[60px] w-full rounded-lg border border-blue-500 p-4 text-center text-2xl focus:outline focus:outline-1 focus:outline-blue-400"
                onChange={(e) => handleInputChange(e, index, false)} // Handle input for new pin
                onKeyDown={(e) => handleKeyDown(e, index, false)}
              />
            ))}
          </div>
        </div>

        <button
          className="borderborder mb-4 rounded-lg border-white bg-[#0c1b4d] px-4 py-3 text-lg font-bold uppercase text-white transition-all duration-300 hover:border-white hover:bg-[#09123a]"
          onClick={handleResetPin}
          disabled={isLoading}
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
            "RESET PIN"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetAdminPinModal;
