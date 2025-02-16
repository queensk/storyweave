const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    <span>Generating...</span>
  </div>
);

export default LoadingSpinner;
