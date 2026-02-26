import {
  ApiResponse,
  LegacyApiError,
  LegacyValidationMessage,
} from "@/interfaces/api.interface";

export function isLegacyApiError(value: unknown): value is LegacyApiError {
  if (typeof value !== "object" || value === null) return false;

  return (
    "statusCode" in value &&
    typeof (value as { statusCode: unknown }).statusCode === "number" &&
    "message" in value &&
    "error" in value
  );
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (typeof value !== "object" || value === null) return false;

  return (
    "success" in value &&
    typeof (value as { success: unknown }).success === "boolean"
  );
}

export function extractLegacyMessage(
  messages: LegacyValidationMessage[] | string,
): string {
  if (typeof messages === "string") {
    return messages;
  }

  return messages
    .map((msg) =>
      msg.constraints
        ? Object.values(msg.constraints).join(", ")
        : "Error de validación",
    )
    .join(" | ");
}
