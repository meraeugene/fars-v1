import { MdOutlineLocalLaundryService } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-4 bg-[#f0f4ff] border-t flex items-center flex-col gap-2">
      <div className="logo flex items-center justify-center gap-2">
        <MdOutlineLocalLaundryService fontSize={24} color="#2563eb" />
        <h1 className="text-[#0c1b4d] font-semibold">FARS</h1>
      </div>

      {/* Copyright */}
      <h1 className="text-center text-xs md:text-sm">
        ⓒ {currentYear} Feedback and Review System. All rights reserved.
      </h1>
    </footer>
  );
};

export default Footer;
