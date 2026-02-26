import { API_URL } from "@/common/constants/api.constant";
import {
  extractLegacyMessage,
  isApiResponse,
  isLegacyApiError,
} from "@/functions/legacy-errors.functions";
import { ApiError, SuccessResponse } from "@/interfaces/api.interface";
import { getLanguage } from "@/libs/server/language";

export async function apiRequest<T, D = unknown>(
  endpoint: string,
  method: string,
  data?: D,
  headers?: HeadersInit,
  accessToken?: string,
): Promise<SuccessResponse<T>> {
  const lang = await getLanguage();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "accept-language": lang,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...headers,
    },
    ...(data && { body: JSON.stringify(data) }),
  });

  let parsed: unknown;

  try {
    parsed = await response.json();
  } catch {
    throw new ApiError({
      message: "Respuesta inválida del servidor",
      code: "INVALID_JSON",
      statusCode: response.status,
    });
  }

  /**
   * 🧨 1. Error legacy (NestJS ValidationPipe)
   */
  if (isLegacyApiError(parsed)) {
    throw new ApiError({
      message: extractLegacyMessage(parsed.message),
      code: parsed.error,
      statusCode: parsed.statusCode,
      details: Array.isArray(parsed.message) ? parsed.message : undefined,
    });
  }

  /**
   * ✅ 2. Respuesta moderna (SUCCESS TRUE → éxito inmediato)
   */
  if (isApiResponse<T>(parsed) && parsed.success === true) {
    return {
      data: parsed.data as T,
      meta: parsed.meta ?? null,
    };
  }

  /**
   * ❌ 3. Respuesta moderna (SUCCESS FALSE)
   */
  if (isApiResponse<T>(parsed) && parsed.success === false) {
    throw new ApiError({
      message: parsed.error?.message ?? "Error desconocido",
      code: parsed.error?.code ?? "UNKNOWN_ERROR",
      statusCode: response.status,
    });
  }

  /**
   * 🧨 4. Caso imposible
   */
  throw new ApiError({
    message: "Formato de respuesta no soportado",
    code: "UNSUPPORTED_RESPONSE",
    statusCode: response.status,
  });
}
