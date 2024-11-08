import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  useLogoutAdminMutation,
  useVerifyTokenQuery,
} from "@/slices/adminApiSlice";
import { logout } from "@/slices/authSlice";
import { ErrorResponse, RootState } from "@/types";
import { toast } from "react-toastify";
import ResetAdminPinModal from "./ResetAdminPinModal";
import LoginAdminPinModal from "./LoginAdminPinModal";

const Header = () => {
  const { adminToken: isLoggedIn } = useSelector(
    (state: RootState) => state.auth,
  );

  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const [adminPinModal, setAdminPinModal] = useState<boolean>(false);
  const [resetPinModal, setResetPinModal] = useState<boolean>(false);

  const toggleNav = () => {
    setMobileNav((prev) => !prev);
    document.body.classList.toggle("menu-open");
  };

  const toggleAdminPinModal = () => {
    setAdminPinModal((prev) => {
      const newState = !prev;

      // Toggle the admin pin and mobile nav states
      if (newState) {
        setMobileNav(false); // Close the mobile nav when opening the admin pin
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }

      return newState;
    });
  };

  const toggleResetPinModal = () => {
    setResetPinModal((prev) => {
      const newState = !prev;

      // Toggle the admin pin and mobile nav states
      if (newState) {
        setMobileNav(false); // Close the mobile nav when opening the admin pin
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }

      return newState;
    });
  };

  // LOGOUT
  const [logoutAdmin] = useLogoutAdminMutation();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    setMobileNav((prev) => !prev);
    document.body.classList.remove("menu-open");

    try {
      await logoutAdmin({}).unwrap();
      dispatch(logout());
    } catch (error) {
      console.log(error);

      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  // LOGOUT IF TOKEN IS EXPIRED
  const validateTokenQuery = useVerifyTokenQuery({});

  useEffect(() => {
    if (validateTokenQuery.isError) {
      dispatch(logout());
    }
  }, [dispatch, validateTokenQuery.isError]);

  // SCROLL TO SECTIONS

  // Scroll Section Color Change Logic
  const [activeSection, setActiveSection] = useState("");

  // Function to handle scrolling
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id); // Set the clicked section as active
      setMobileNav(false);
      document.body.classList.remove("menu-open");
    }
  };

  return (
    <header className="fixed top-0 z-30 w-full bg-[#f0f4ff]">
      <div className="nav-mobile__container flex w-full items-center justify-between border border-b-[#e0e4f5] px-5 py-2 md:px-10 lg:hidden lg:px-16">
        <div className="logo flex items-center gap-2">
          <MdOutlineLocalLaundryService fontSize={30} color="#2563eb" />
          <h1
            className="cursor-pointer font-semibold text-[#0c1b4d]"
            onClick={() => scrollToSection("home")}
          >
            FARS
          </h1>
        </div>
        <button aria-label="nav-menu-icon" onClick={toggleNav}>
          <RxHamburgerMenu fontSize={24} />
        </button>
      </div>

      <div className="nav__container hidden w-full justify-between border border-b-[#e0e4f5] px-5 py-2 md:px-10 lg:flex lg:items-center lg:px-16 xl:px-40 xl:py-3">
        <div className="logo flex items-center gap-2">
          <MdOutlineLocalLaundryService fontSize={30} color="#2563eb" />
          <h1
            className="cursor-pointer font-semibold"
            onClick={() => scrollToSection("home")}
          >
            FARS
          </h1>
        </div>

        <nav>
          <ul className="flex gap-6">
            {[
              "home",
              "feedback",
              "featured-reviews",
              "all-reviews",
              "FAQs",
            ].map((sectionId) => (
              <li
                key={sectionId}
                onClick={() => scrollToSection(sectionId)}
                className={`cursor-pointer text-base capitalize transition-all duration-300 ease-in-out hover:text-[#0c1b4d] ${
                  activeSection === sectionId
                    ? "font-semibold text-[#0c1b4d]"
                    : ""
                }`}
              >
                {sectionId.replace("-", " ")}
              </li>
            ))}
            {!isLoggedIn && (
              <li
                className="cursor-pointer text-base transition-all duration-300 ease-in-out"
                onClick={toggleAdminPinModal}
              >
                Login as Owner
              </li>
            )}
            {isLoggedIn && (
              <>
                <li
                  onClick={toggleResetPinModal}
                  className="cursor-pointer text-base transition-all duration-300 ease-in-out"
                >
                  Reset Admin PIN
                </li>
                <li
                  className="cursor-pointer text-base transition-all duration-300 ease-in-out"
                  onClick={logoutHandler}
                >
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {mobileNav && (
        <div className="mobile-nav slide-in-right nav-color fixed right-0 top-0 z-[50] h-screen w-[60%] md:w-1/3 lg:hidden">
          <div className="relative p-10 px-8">
            <button
              onClick={toggleNav}
              aria-label="close-icon"
              className="absolute right-[18px] top-[12px] md:right-[37px]"
            >
              <IoCloseOutline fontSize={28} />
            </button>
            <nav>
              <ul className="mt-10 flex flex-col gap-6">
                {[
                  "home",
                  "feedback",
                  "featured-reviews",
                  "all-reviews",
                  "FAQs",
                ].map((sectionId) => (
                  <li
                    key={sectionId}
                    onClick={() => scrollToSection(sectionId)}
                    className={`cursor-pointer text-base capitalize transition-all duration-300 ease-in-out ${
                      activeSection === sectionId
                        ? "font-semibold text-[#0c1b4d]"
                        : ""
                    }`}
                  >
                    {sectionId.replace("-", " ")}
                  </li>
                ))}
                {!isLoggedIn && (
                  <li
                    className="cursor-pointer text-base transition-all duration-300 ease-in-out"
                    onClick={toggleAdminPinModal}
                  >
                    Login as Owner
                  </li>
                )}
                {isLoggedIn && (
                  <>
                    <li
                      onClick={toggleResetPinModal}
                      className="cursor-pointer text-base transition-all duration-300 ease-in-out"
                    >
                      Reset Admin PIN
                    </li>
                    <li
                      className="cursor-pointer text-base transition-all duration-300 ease-in-out"
                      onClick={logoutHandler}
                    >
                      Logout
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {adminPinModal && (
        <LoginAdminPinModal closeAdminPinModal={toggleAdminPinModal} />
      )}

      {resetPinModal && (
        <ResetAdminPinModal closeResetPinModal={toggleResetPinModal} />
      )}
    </header>
  );
};

export default Header;
