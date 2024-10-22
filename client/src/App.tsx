import Footer from "./components/Footer.tsx";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./utils/scrollToTop.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tailspin } from "ldrs";
import { dotPulse } from "ldrs";
import { lineSpinner } from "ldrs";

const App = () => {
  tailspin.register();
  dotPulse.register();
  lineSpinner.register();

  return (
    <>
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={true}
        theme="light"
      />
    </>
  );
};

export default App;
