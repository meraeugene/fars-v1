import { MdOutlineLocalLaundryService } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-4 border-t flex items-center flex-col gap-2">
      <div className="logo flex items-center justify-center gap-2">
        <MdOutlineLocalLaundryService fontSize={24} />
        <h1>Zerca</h1>
      </div>

      {/* Copyright */}
      <h1 className="text-center text-xs">
        ⓒ {currentYear} Kitchen Tales. All rights reserved.
      </h1>
    </footer>
  );
};

export default Footer;
