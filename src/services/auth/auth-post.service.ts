import { SuccessResponse } from "@/interfaces/api.interface";
import { SignUpForm } from "@/interfaces/forms/signUpForm";
import { apiRequest } from "@/services/api";

/**
 * Inicia sesión en la plataforma.
 * @param {loginForm} data - Los datos del formulario de inicio de sesión.
 * @returns {Promise<SuccessResponse<ResponseLogin>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 */
export interface loginForm {
  email: string;
  password: string;
}

export interface ResponseLogin {
  refreshToken: string;
}

export async function login(
  data: loginForm,
): Promise<SuccessResponse<ResponseLogin>> {
  return await apiRequest<ResponseLogin, loginForm>(
    "/auth/sign-in",
    "POST",
    data,
  );
}

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

/**
 *
 * @param {string} password - La contraseña del usuario.
 * @param {string} token - El token de autenticación del usuario actual.
 * @returns {Promise<SuccessResponse<string>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 */
export async function reAuth(
  data: { password: string },
  token: string,
): Promise<SuccessResponse<string>> {
  return apiRequest<string, { password: string }>(
    "/auth/re-auth",
    "POST",
    data,
    undefined,
    token,
  );
}

/**
 *
 * @param {string} token - El token de autenticación del usuario actual.
 * @returns {Promise<SuccessResponse<null>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 */
export async function enable2FA(
  data: { twoFactorType: string },
  token: string,
  reauth: string,
): Promise<SuccessResponse<null>> {
  return await apiRequest<null, { twoFactorType: string }>(
    "/auth/2fa/enable",
    "POST",
    data,
    undefined,
    token,
    reauth,
  );
}

export async function confirm2FA(
  data: { code: string },
  token: string,
): Promise<SuccessResponse<null>> {
  return await apiRequest<null, { code: string }>(
    "/auth/2fa/confirm",
    "POST",
    data,
    undefined,
    token,
  );
}

export async function disable2FA(
  token: string,
): Promise<SuccessResponse<null>> {
  return await apiRequest<null, undefined>(
    "/auth/2fa/disable",
    "POST",
    undefined,
    undefined,
    token,
  );
}

export async function verify2FA(data: {
  code: string;
  tempToken: string; // luego se cambia por token temporal
}): Promise<SuccessResponse<ResponseLogin>> {
  return await apiRequest<ResponseLogin, { code: string; tempToken: string }>(
    "/auth/2fa/verify",
    "POST",
    data,
  );
}

/**
 * Restablece la contraseña de un usuario.
 * @param {string} email - El correo electrónica del usuario.
 * @returns {Promise<SuccessResponse<null>>} Una promesa que resuelve con la respuesta del servidor.
 * @throws {ApiError} Si ocurre un error en la solicitud.
 */
export async function resetPassword(data: {
  email: string;
}): Promise<SuccessResponse<null>> {
  return await apiRequest<null, { email: string }>(
    "/auth/reset-password",
    "POST",
    data,
  );
}

export async function resetPasswordToken(
  token: string,
  data: {
    password: string;
    password_confirm: string;
  },
): Promise<SuccessResponse<null>> {
  return await apiRequest<null, { password: string; password_confirm: string }>(
    `/auth/reset-password/${token}`,
    "POST",
    data,
  );
}
