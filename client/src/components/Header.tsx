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
import AdminPinModal from "./AdminPinModal";
import ResetAdminPinModal from "./ResetAdminPinModal";

const Header = () => {
  const { adminToken: isLoggedIn } = useSelector(
    (state: RootState) => state.auth
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
    document.body.classList.toggle("menu-open");

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

  useEffect(() => {
    const sections = ["hero", "featured-reviews", "feedback", "all-reviews"];
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  // Function to handle scrolling
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMobileNav(false);
      document.body.classList.remove("menu-open");
    }
  };

  return (
    <header className="fixed w-full top-0 z-30 bg-white">
      <div className="border-b w-full  nav-mobile__container flex items-center justify-between py-2 px-4">
        <div className="logo flex items-center gap-2">
          <MdOutlineLocalLaundryService fontSize={30} />
          <h1>Zerca</h1>
        </div>
        <button onClick={toggleNav}>
          <RxHamburgerMenu fontSize={20} />
        </button>
      </div>

      {mobileNav && (
        <div className=" mobile-nav slide-in-right nav-color fixed right-0 top-0 z-[50]     h-screen w-[60%]  md:hidden">
          <div className="relative p-10  px-8">
            <button
              onClick={toggleNav}
              className="absolute right-[13px] top-[12px]"
            >
              <IoCloseOutline fontSize={25} />
            </button>
            <nav>
              <ul className="mt-10 flex flex-col gap-6 ">
                {["hero", "featured-reviews", "feedback", "all-reviews"].map(
                  (sectionId) => (
                    <li
                      key={sectionId}
                      onClick={() => scrollToSection(sectionId)}
                      className={`text-lg capitalize transition-all duration-300 ease-in-out ${
                        activeSection === sectionId ? "text-blue-600" : ""
                      }`}
                    >
                      {sectionId.replace("-", " ")}
                    </li>
                  )
                )}
                {!isLoggedIn && (
                  <li
                    className=" text-lg transition-all duration-300 ease-in-out"
                    onClick={toggleAdminPinModal}
                  >
                    Login as Admin
                  </li>
                )}
                {isLoggedIn && (
                  <>
                    <li
                      onClick={toggleResetPinModal}
                      className=" text-lg transition-all duration-300 ease-in-out"
                    >
                      Reset Admin PIN
                    </li>
                    <li
                      className=" text-lg transition-all duration-300 ease-in-out"
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
        <AdminPinModal closeAdminPinModal={toggleAdminPinModal} />
      )}

      {resetPinModal && (
        <ResetAdminPinModal closeResetPinModal={toggleResetPinModal} />
      )}
    </header>
  );
};

export default Header;
