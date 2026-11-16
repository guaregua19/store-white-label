import { notFound } from "next/navigation";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Resultado serializable de una llamada al backend. Los cuerpos con "use cache"
 * se serializan, y un ApiError lanzado dentro llegaría al llamador como un Error
 * genérico (sin status), así que se cachea el resultado y se relanza afuera.
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; code?: string };

export async function settle<T>(promise: Promise<T>): Promise<ApiResult<T>> {
  try {
    return { ok: true, data: await promise };
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, status: e.status, message: e.message, code: e.code };
    throw e;
  }
}

export function unwrap<T>(result: ApiResult<T>): T {
  if (result.ok) return result.data;
  throw new ApiError(result.status, result.message, result.code);
}

export function isNotFoundOrBlocked(e: unknown): e is ApiError {
  return e instanceof ApiError && (e.status === 404 || e.status === 403);
}

/** Slug inexistente, tenant bloqueado o recurso ausente → not-found del segmento. */
export async function orNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (e) {
    if (isNotFoundOrBlocked(e)) notFound();
    throw e;
  }
}
