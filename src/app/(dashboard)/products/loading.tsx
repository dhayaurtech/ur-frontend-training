const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-violet-500">
        <div className="h-4 w-4 rounded-full border-4 border-violet-500"></div>
      </div>
    </div>
  );
};

export default Loading;