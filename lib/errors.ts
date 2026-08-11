export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Autenticação falhou') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Acesso não permitido') {
    super(403, message);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Dados inválidos', details?: Record<string, any>) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Recurso já existe') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Muitas requisições. Tente novamente mais tarde.') {
    super(429, message);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'Erro interno do servidor', details?: Record<string, any>) {
    super(500, message, details);
    this.name = 'ServerError';
  }
}

/**
 * Handle API errors uniformly
 */
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      message: 'Erro interno do servidor',
      details: { originalError: error.message },
    };
  }

  return {
    statusCode: 500,
    message: 'Erro desconhecido',
  };
}
