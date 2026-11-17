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
