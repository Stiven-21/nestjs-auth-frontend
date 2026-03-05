# Nest Auth Frontend - Base Inicial

Este proyecto es un frontend desarrollado con **Next.js** que sirve como base inicial para interactuar con el backend **NEST AUTH**. Nest Auth es un servidor de autenticación modular, extensible y listo para producción, desarrollado con NestJS, diseñado para eliminar la necesidad de crear sistemas de autenticación y autorización desde cero.

## 🚀 Inicio Rápido

### Descarga y Proceso de Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Stiven-21/nestjs-auth-frontend.git
   cd nestjs-auth-frontend
   ```

2. **Instalar dependencias:**
   Puedes usar `pnpm`, `npm` o `yarn`:

   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y configura la URL de tu API (por defecto apunta a `http://localhost:8000/api/v1` si no se especifica):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## 🛠 Backend Compatible

Para que este frontend funcione correctamente, debes contar con el servidor de autenticación ejecutándose. Puedes descargarlo aquí:

👉 **[Nest Auth Backend](https://github.com/Stiven-21/nestjs-auth-backend)**

---

## 🖥 Vistas Creadas y Configuradas

El proyecto ya cuenta con las siguientes vistas base configuradas:

- **Inicio (`/`)**: Página de bienvenida principal.
- **Sign In (`/auth/sign-in`)**: Formulario de inicio de sesión.
- **Sign Up (`/auth/sign-up`)**: Formulario de registro de nuevos usuarios.
- **Reset Password (`/auth/reset-password`)**: Interfaz para solicitar el restablecimiento de contraseña y cambio de la misma mediante token (`/auth/reset-password/[token]`).
- **Verify Email (`/auth/verify-email/[token]`)**: Vista para la confirmación de correo electrónico.
- **Dashboard (`/dashboard`)**: Área protegida para usuarios autenticados.
- **Callback (`/auth/callback`)**: Ruta encargada de gestionar el flujo de autenticación.

> [!IMPORTANT]
> **Nota:** Estas vistas son una **base inicial para pruebas**. Están diseñadas para ser funcionales pero deben ser mejoradas, personalizadas y reestructuradas según los requerimientos específicos y el diseño de tu aplicación final.

---

## 📁 Estructura de Carpetas (`src/`)

Para mantener la consistencia y escalabilidad del proyecto, se utiliza la siguiente estructura dentro de la carpeta `src/`:

| Carpeta           | Contenido y Propósito              | Qué se espera encontrar                                                                       |
| :---------------- | :--------------------------------- | :-------------------------------------------------------------------------------------------- |
| **`action/`**     | Server Actions de Next.js.         | Lógica que se ejecuta en el servidor (mutaciones, manejo de cookies, cambios de tema/idioma). |
| **`app/`**        | Enrutamiento (App Router).         | Páginas (`page.tsx`), layouts (`layout.tsx`), y rutas de API locales.                         |
| **`common/`**     | Elementos genéricos y compartidos. | Componentes de UI transversales (ej. Select, ClickOutSide) o constantes globales.             |
| **`components/`** | Componentes de la interfaz.        | Dividido en `ui/` (átomos), `layout/`, `sections/`, y `providers/`.                           |
| **`data/`**       | Datos estáticos.                   | Listas de opciones, configuraciones de temas o idiomas que no cambian frecuentemente.         |
| **`functions/`**  | Funciones puras.                   | Helpers lógicos, formateadores de fechas, extractores de errores, etc.                        |
| **`hooks/`**      | Custom Hooks de React.             | Lógica de estado reutilizable tanto global como específica de funcionalidades.                |
| **`i18n/`**       | Internacionalización.              | Diccionarios JSON (`es.json`, `en.json`) y configuración de `next-intl`.                      |
| **`interfaces/`** | Tipado de TypeScript.              | Definición de contratos para la API, modelos de datos y estructuras de formularios.           |
| **`libs/`**       | Configuraciones de librerías.      | Instancias de clientes API, utilidades de servidor (cookies, theme) y wrappers de terceros.   |
| **`provider/`**   | Context Providers.                 | Proveedores de contexto para estados globales (Tema, Idioma, Sesión).                         |
| **`services/`**   | Llamadas a la API externa.         | Funciones encargadas de las peticiones HTTP organizadas por módulos (auth, user, token).      |
| **`types/`**      | Definiciones de tipos globales.    | Extensiones de tipos de librerías (ej. `next-auth.d.ts`) y tipos globales de TS.              |
| **`utils/`**      | Utilidades generales.              | Funciones de apoyo como gestión de permisos o lógica miscelánea.                              |

---

## 📡 Gestión de API (`src/services/api.ts`)

La comunicación con el backend se centraliza en `src/services/api.ts` mediante la función `apiRequest`.

### Estructura y Funcionamiento

La función `apiRequest` es un wrapper avanzado de `fetch` que automatiza tareas repetitivas y estandariza la comunicación:

- **Tipado Genérico**: Permite definir el tipo de datos esperado (`T`) y el tipo de los datos enviados (`D`).
- **Inyección Automática de Cabeceras**:
  - `Content-Type`: Siempre `application/json`.
  - `accept-language`: Detecta e inyecta el idioma actual de la aplicación automáticamente.
  - `Authorization`: Si se proporciona un `accessToken`, se añade como Bearer token.
  - `X-Reauth-Token`: Soporte para flujos de re-autenticación.
- **Normalización de Errores**:
  - **Legacy Errors**: Maneja los errores de validación estándar de NestJS (ValidationPipe).
  - **Modern Response**: Interpreta el formato estándar del backend (`{ success, data, error, meta }`).
  - **Invalid JSON**: Gestiona respuestas que no son JSON válido.

### Ejemplo de Uso

```typescript
import { apiRequest } from "@/services/api";

async function getUserProfile() {
  try {
    const response = await apiRequest<UserType>(
      "/users/profile",
      "GET",
      null, // body
      {}, // extra headers
      accessToken,
    );
    console.log(response.data);
  } catch (error) {
    // Los errores están normalizados bajo la clase ApiError
    console.error(error.message, error.code);
  }
}
```

---

## 🏗 Tecnologías Utilizadas

- **Next.js 15+**
- **React 19**
- **NextAuth.js v5 (Beta)**
- **Tailwind CSS**
- **TypeScript**
- **Next-intl** (Internacionalización)
