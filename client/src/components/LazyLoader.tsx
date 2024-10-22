const LazyLoader = () => {
  return (
    <div className={`flex h-screen mt-8 w-full items-center justify-center`}>
      <l-line-spinner
        size="30"
        stroke="3"
        speed="1"
        color="#3b82f6"
      ></l-line-spinner>{" "}
    </div>
  );
};

export default LazyLoader;
