import { ZodError } from "zod";
import { UnauthorizedError } from "./unAuthError";
import { EmailError } from "./EmailError";
import { Prisma } from "@libs/db/prisma/generated/prisma";
import { ErrorResponse } from "../next-response";
import { errors as JoseErrors } from "jose";

const isJwtError = (error: unknown): boolean => {
  return (
    error instanceof JoseErrors.JWTExpired ||
    error instanceof JoseErrors.JWTInvalid ||
    error instanceof JoseErrors.JWSSignatureVerificationFailed ||
    error instanceof JoseErrors.JWTClaimValidationFailed ||
    error instanceof JoseErrors.JWSInvalid
  );
};
export const handleApiErrors = (error: unknown) => {
  // how to ahndle here all jwt error from jose
  if (isJwtError(error)) {
    return ErrorResponse({
      message: "Unauthorized",
      status: 401,
    });
  }

  if (error instanceof ZodError) {
    return ErrorResponse({
      message: error.issues[0].message,
      error: error.issues,
      status: 400,
    });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return ErrorResponse({ error, status: 400 });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return ErrorResponse({ error, status: 400 });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ErrorResponse({ error, status: 400 });
  }

  if (error instanceof EmailError) {
    return ErrorResponse({
      message: error.message || "Failed to send email",
      error,
      status: error.status,
    });
  }

  if (error instanceof UnauthorizedError) {
    return ErrorResponse({
      message: error.message || "Unauthorized",
      status: error.status,
    });
  }

  if (error instanceof Error) {
    return ErrorResponse({
      message: error.message,
      error,
    });
  }

  return ErrorResponse({ message: "Internal Server Error", error });
};
