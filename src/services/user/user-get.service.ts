import { SuccessResponse } from "@/interfaces/api.interface";
import { apiRequest } from "@/services/api";

/**
 * @interface Oauth
 * @description Representa la estructura de la información de autenticación de un proveedor.
 * @property {number} id - El ID de la autenticación externa.
 * @property {string} provider - El proveedor de autenticación (ej. "google", "facebook", etc.).
 * @property {string} providerId - El ID del usuario en el proveedor de autenticación.
 * @property {string} avatar - La URL de la imagen de perfil del usuario en el proveedor de autenticación.
 */

export interface Oauth {
  id: number;
  provider: string;
  providerId: string;
  avatar: string;
}

/**
 * @interface UserMe
 * @description Representa la estructura de la información de un usuario.
 * @property {number} id - El ID del usuario.
 * @property {string} avatar - La URL de la imagen de perfil del usuario.
 * @property {string} name - El nombre del usuario.
 * @property {string} lastname - El apellido del usuario.
 * @property {string} document - El documento de identificación del usuario.
 * @property {string} email - El correo electrónica del usuario.
 * @property {string} status - El estado del usuario (activo, inactivo, etc.).
 * @property {string} createdAt - La fecha y hora de creación del usuario.
 * @property {string} updatedAt - La fecha y hora de actualización del usuario.
 * @property {IdentityType} identityType - El tipo de identificación del usuario.
 * @property {Role} role - La información de la rol del usuario.
 * @property {Oauth[]} oauth - La información de autenticación externa del usuario.
 */

export interface UserMe {
  id: number;
  avatar: string | null;
  name: string;
  lastname: string;
  document: string | null;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  identityType: null;
  role: {
    id: number;
    name: string;
    permissions: string;
    createdAt: string;
  };
  oauth: Oauth[];
}

/**
 * Obtiene la información del usuario actual.
 * @returns {Promise<UserMe>} Una promesa que resuelve con la información del usuario actual.
 */

export async function me(token: string): Promise<SuccessResponse<UserMe>> {
  return await apiRequest<UserMe, undefined>(
    "/users/profile/me",
    "GET",
    undefined,
    undefined,
    token,
  );
}
