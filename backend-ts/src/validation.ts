import { z } from "zod";

export const VALID_TONES = ['professional', 'casual', 'humorous', 'urgent', 'inspirational'] as const;
export const VALID_PLATFORMS = ['twitter', 'instagram', 'linkedin'] as const;

export const ToneSchema = z.enum(VALID_TONES);
export const PlatformSchema = z.enum(VALID_PLATFORMS);

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must be 200 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be 2000 characters or less"),
  price: z
    .number()
    .min(0, "Price must be a positive number")
    .max(1000000, "Price must be less than $1,000,000"),
  category: z
    .string()
    .max(100, "Category must be 100 characters or less")
    .optional(),
  tone: ToneSchema.optional().default('professional'),
  platforms: z
    .array(PlatformSchema)
    .min(1, "At least one platform must be selected")
    .optional()
    .default(['twitter', 'instagram', 'linkedin']),
  includeResearch: z.boolean().optional().default(false),
});

export const GenerateRequestSchema = z.object({
  product: ProductSchema,
});

export type ValidatedProduct = z.infer<typeof ProductSchema>;
export type ValidatedGenerateRequest = z.infer<typeof GenerateRequestSchema>;

export interface ValidationError {
  field: string;
  message: string;
}

export function formatZodErrors(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}
