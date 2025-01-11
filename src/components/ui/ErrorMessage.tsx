interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-fade-in">
      <span>🚫</span>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800 mb-1">
          Calculation Error
        </h3>
        <p className="text-sm text-red-600">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
