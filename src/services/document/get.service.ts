import { SuccessResponse } from "@/interfaces/api.interface";
import { apiRequest } from "@/services/api";

/**
 * @interface IdentityType
 * @description Representa la estructura de un tipo de identificación.
 * @property {number} id - El ID del tipo de identificación.
 * @property {string} name - El nombre del tipo de identificación (ej. "Cédula de Ciudadanía").
 * @property {string} abrev - La abreviación del tipo de identificación (ej. "CC").
 */
export interface IdentityType {
  id: number;
  name: string;
  abrev: string;
}

/**
 * Obtiene todos los tipos de identificación disponibles.
 * @returns {Promise<IdentityType[]>} Una promesa que resuelve con un array de objetos IdentityType.
 */
export async function findAllIdentityTypes(): Promise<
  SuccessResponse<IdentityType[]>
> {
  return await apiRequest<IdentityType[], undefined>(
    "/identity-types",
    "GET",
    undefined,
  );
}

/**
 * Obtiene un tipo de identificación específico por su ID.
 * @param {number} id - El ID del tipo de identificación a buscar.
 * @returns {Promise<IdentityType>} Una promesa que resuelve con el objeto IdentityType encontrado.
 */
export async function findOneIdentityType(
  id: number,
): Promise<SuccessResponse<IdentityType>> {
  return apiRequest<IdentityType, undefined>(
    `/id-types/${id}`,
    "GET",
    undefined,
  );
}
