import { SuccessResponse } from "@/interfaces/api.interface";
import { apiRequest } from "../api";

export async function validateToken(
  token: string,
): Promise<SuccessResponse<null>> {
  return await apiRequest<null, undefined>(`/tokens/verify/${token}`, "GET");
}
