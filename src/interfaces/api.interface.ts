/**
 * @interface ApiErrorResponse
 * @description Estructura esperada para las respuestas de error de la API.
 * @property {string} message - Mensaje de error.
 * @property {number} statusCode - Código de estado HTTP.
 * @property {string} error - Tipo de error (ej. "Bad Request").
 */

export interface SuccessResponse<T> {
  data: T | null;
  meta: Record<string, unknown> | null;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta: Record<string, string> | null;
  error: ApiBusinessError | null;
}

export interface ApiBusinessError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta: Record<string, string> | null;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface LegacyApiError {
  statusCode: number;
  message: LegacyValidationMessage[] | string;
  error: string;
}

export interface LegacyValidationMessage {
  property: string;
  constraints?: Record<string, string>;
}

/**
 * Clase de error personalizada para manejar errores de la API.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: LegacyValidationMessage[];

  constructor(params: {
    message: string;
    code: string;
    statusCode: number;
    details?: LegacyValidationMessage[];
  }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code;
    this.statusCode = params.statusCode;
    this.details = params.details;
  }
}
