import { NextResponse } from "next/server";

// Error types for better error handling
export enum ErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMIT = "RATE_LIMIT",
  SERVER_ERROR = "SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
}

// Error class for structured error handling
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    type: ErrorType,
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorType.VALIDATION_ERROR, message, 400, true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(ErrorType.AUTHENTICATION_ERROR, message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(ErrorType.AUTHORIZATION_ERROR, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(ErrorType.NOT_FOUND, `${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorType.CONFLICT, message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(ErrorType.RATE_LIMIT, message, 429);
  }
}

export class ServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(ErrorType.SERVER_ERROR, message, 500, false);
  }
}

// Error response formatter
export function formatErrorResponse(error: AppError | Error): NextResponse {
  console.error("Error occurred:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error instanceof AppError && { type: error.type, details: error.details }),
  });

  if (error instanceof AppError) {
    const response: any = {
      success: false,
      error: error.message,
      type: error.type,
    };

    // Include details for validation errors
    if (error.details) {
      response.details = error.details;
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // For unexpected errors, don't expose internal details
  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred",
      type: ErrorType.SERVER_ERROR,
    },
    { status: 500 }
  );
}

// Async error wrapper for route handlers
export function withErrorHandler(
  handler: (req: Request, ...args: any[]) => Promise<Response>
) {
  return async (req: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      if (error instanceof AppError) {
        return formatErrorResponse(error);
      }
      
      // Handle Prisma errors
      if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error as any;
        switch (prismaError.code) {
          case 'P2002':
            return formatErrorResponse(
              new ConflictError("A record with this value already exists")
            );
          case 'P2025':
            return formatErrorResponse(
              new NotFoundError("Record")
            );
          default:
            return formatErrorResponse(
              new ServerError("Database operation failed")
            );
        }
      }

      // Handle Zod validation errors
      if (error instanceof Error && error.name === 'ZodError') {
        return formatErrorResponse(
          new ValidationError("Invalid input data", (error as any).errors)
        );
      }

      // Handle JWT errors
      if (error instanceof Error && (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError' ||
        error.name === 'NotBeforeError'
      )) {
        return formatErrorResponse(
          new AuthenticationError("Invalid or expired token")
        );
      }

      // Generic error handling
      return formatErrorResponse(
        error instanceof Error ? new ServerError(error.message) : new ServerError()
      );
    }
  };
}

// Safe JSON parsing with error handling
export function safeJsonParse<T>(str: string, fallback?: T): T | null {
  try {
    return JSON.parse(str);
  } catch (error) {
    return fallback || null;
  }
}

// Database transaction wrapper with error handling
export async function withTransaction<T>(
  callback: (tx: any) => Promise<T>
): Promise<T> {
  try {
    // This would need to be implemented based on your database setup
    // For now, just execute the callback
    return await callback(null);
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new ServerError("Transaction failed");
  }
}

// Rate limiting error helper
export function createRateLimitResponse(retryAfter?: number): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      error: "Too many requests",
      type: ErrorType.RATE_LIMIT,
    },
    { status: 429 }
  );

  if (retryAfter) {
    response.headers.set("Retry-After", String(retryAfter));
  }

  return response;
}

// Validation error helper
export function createValidationErrorResponse(
  message: string,
  details?: any
): NextResponse {
  return formatErrorResponse(new ValidationError(message, details));
}

// Authentication error helper
export function createAuthenticationErrorResponse(
  message: string = "Authentication required"
): NextResponse {
  return formatErrorResponse(new AuthenticationError(message));
}

// Authorization error helper
export function createAuthorizationErrorResponse(
  message: string = "Insufficient permissions"
): NextResponse {
  return formatErrorResponse(new AuthorizationError(message));
}

// Not found error helper
export function createNotFoundErrorResponse(
  resource: string = "Resource"
): NextResponse {
  return formatErrorResponse(new NotFoundError(resource));
}

// Conflict error helper
export function createConflictErrorResponse(message: string): NextResponse {
  return formatErrorResponse(new ConflictError(message));
}