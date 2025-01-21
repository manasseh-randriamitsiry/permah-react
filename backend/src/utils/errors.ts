export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (error: Error | AppError) => {
  if (error instanceof AppError && error.isOperational) {
    return {
      status: error.statusCode,
      message: error.message
    };
  }
  
  // For unhandled errors
  return {
    status: 500,
    message: 'Internal server error'
  };
}; 