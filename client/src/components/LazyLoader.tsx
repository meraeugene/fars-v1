const LazyLoader = () => {
  return (
    <div
      className={`flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#f0f4ff]`}
    >
      {/* <l-line-spinner
        size="30"
        stroke="3"
        speed="1"
        color="#3b82f6"
      ></l-line-spinner>{" "} */}
      <div className="loader"></div>
      <h1 className="font-semibold text-[#0c1b4d]">FARS</h1>
    </div>
  );
};

export default LazyLoader;
