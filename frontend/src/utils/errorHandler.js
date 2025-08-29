// Frontend error handling utility
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

// Handle API errors with user-friendly messages
export const handleApiError = (error, context = '') => {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.error || 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return data.error || 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.error || `Unexpected error (${status}). Please try again.`;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection and try again.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Handle localStorage errors
export const handleStorageError = (error, operation = 'access storage') => {
  console.error(`Storage Error during ${operation}:`, error);
  
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    return 'Storage limit exceeded. Please clear some data and try again.';
  } else if (error instanceof SyntaxError) {
    return 'Data corruption detected. Please refresh the page.';
  } else {
    return `Failed to ${operation}. Please try again.`;
  }
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

// Error boundary component (for React error boundaries)
export const withErrorBoundary = (WrappedComponent, FallbackComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <FallbackComponent error={this.state.error} />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Default error fallback component
export const DefaultErrorFallback = ({ error }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded">
    <h3 className="font-bold mb-2">Something went wrong</h3>
    <p>{error?.message || 'An unexpected error occurred.'}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
    >
      Reload Page
    </button>
  </div>
);
