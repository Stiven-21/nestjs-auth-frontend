import { SuccessResponse } from "@/interfaces/api.interface";
import { apiRequest } from "@/services/api";

export async function find2FATypes(): Promise<SuccessResponse<string[]>> {
  return await apiRequest<string[], undefined>("/2fa-types", "GET");
}
