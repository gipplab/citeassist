// Access the runtime environment configuration
interface WindowWithEnv extends Window {
  ENV?: {
    REACT_APP_BACKEND_URL?: string;
  };
}

// Get environment variables from runtime config or fallback to process.env or default values
const getEnv = () => {
  const windowWithEnv = window as WindowWithEnv;
  
  return {
    BACKEND_URL: 
      windowWithEnv.ENV?.REACT_APP_BACKEND_URL || 
      process.env.REACT_APP_BACKEND_URL || 
      'http://localhost:9000'
  };
};

export const env = getEnv(); 