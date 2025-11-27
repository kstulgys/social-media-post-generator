import { Product, FieldErrors } from "@/types";
import { VALIDATION } from "@/constants";

export function validateProduct(product: Product): FieldErrors {
  const errors: FieldErrors = {};

  if (!product.name.trim()) {
    errors.name = "Product name is required";
  } else if (product.name.length > VALIDATION.NAME_MAX_LENGTH) {
    errors.name = `Product name must be ${VALIDATION.NAME_MAX_LENGTH} characters or less`;
  }

  if (!product.description.trim()) {
    errors.description = "Description is required";
  } else if (product.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH) {
    errors.description = `Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters`;
  } else if (product.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters or less`;
  }

  if (!product.price || product.price <= 0) {
    errors.price = "Price is required";
  } else if (product.price > VALIDATION.PRICE_MAX) {
    errors.price = `Price must be less than $${VALIDATION.PRICE_MAX.toLocaleString()}`;
  }

  if (!product.platforms || product.platforms.length === 0) {
    errors.platforms = "At least one platform must be selected";
  }

  return errors;
}

export function isValidPriceInput(value: string): boolean {
  return value === "" || /^\d*\.?\d{0,2}$/.test(value);
}
