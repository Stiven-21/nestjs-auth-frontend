import { SuccessResponse } from "@/interfaces/api.interface";
import { SignUpForm } from "@/interfaces/forms/signUpForm";
import { apiRequest } from "@/services/api";

/**
 * Registra un nuevo usuario en la plataforma.
 * @param {SignUpForm} data - Los datos del formulario de registro.
 * @returns {Promise<SuccessResponse<null>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 */
export async function signUp(data: SignUpForm): Promise<SuccessResponse<null>> {
  return await apiRequest<null, SignUpForm>("/auth/register", "POST", data);
}

/**
 * Desvincula un proveedor de autenticación del usuario actual.
 * @param {string} provider - El proveedor de autenticación a desvincular.
 * @param {string} token - El token de autenticación del usuario actual.
 * @returns {Promise<SuccessResponse<null>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 * @description Esta función utiliza el endpoint `/auth/unlink/{provider}` para desvincular el proveedor de autenticación del usuario actual.
 */
export async function unLinkProvider(
  provider: string,
  token: string,
): Promise<SuccessResponse<null>> {
  return await apiRequest<null, undefined>(
    `/auth/unlink/${provider}`,
    "POST",
    undefined,
    undefined,
    token,
  );
}

/**
 * Cierra la sesión del usuario actual.
 * @param {string} token - El token de autenticación del usuario actual.
 * @returns {Promise<SuccessResponse<null>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 */
export async function logout(token: string): Promise<SuccessResponse<null>> {
  return await apiRequest<null, undefined>(
    "/auth/logout",
    "POST",
    undefined,
    undefined,
    token,
  );
}

/**
 * @interface RefreshToken
 * @description Esta interface representa la respuesta del servidor despues de refrescar el token.
 * @property {string} accessToken - El token de acceso actualizado.
 * @property {string} refreshToken - El token de refresco actualizado.
 */

export interface RefreshToken {
  access_token: string;
  refresh_token: string;
}

/**
 *
 * @param {string} token - El token de autenticación del usuario actual.
 * @returns {Promise<SuccessResponse<RefreshToken>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 *
 */

export async function refreshAccessToken(
  token: string,
): Promise<SuccessResponse<RefreshToken>> {
  return await apiRequest<RefreshToken, undefined>(
    `/auth/refresh-token/${token}`,
    "POST",
    undefined,
    undefined,
    token,
  );
}

/**
 * @param {string} token - El token de verificación de correo electrónica.
 * @returns {Promise<SuccessResponse<null>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 */

export async function verifyEmail(
  token: string,
): Promise<SuccessResponse<null>> {
  return await apiRequest<null, undefined>(
    `/auth/verify-email/${token}`,
    "POST",
    undefined,
    undefined,
  );
}
