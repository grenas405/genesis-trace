/**
 * MODULE: Request Schema Validation
 *
 * PURPOSE:
 * Provides zero-dependency schema validation for HTTP request bodies using
 * only Deno built-in APIs. Validates data structure, types, constraints, and
 * business rules. Type-safe, composable, and explicit following Unix Philosophy.
 *
 * UNIX PHILOSOPHY IMPLEMENTATION:
 * - Do one thing well: Schema validation only (not parsing, not transformation)
 * - Composable: Validation rules compose into schemas, schemas validate data
 * - Text-based: Validation errors are structured text (JSON-serializable)
 * - Explicit: All validation rules explicit in schema, no implicit coercion
 * - Filter pattern: Validates data against explicit criteria
 *
 * ARCHITECTURE:
 * - Rule-based validation: Each rule checks one constraint
 * - Composable schemas: Multiple rules per field
 * - Type-safe errors: ValidationError with field context
 * - Middleware integration: validator() middleware validates ctx.state.body
 * - Zero dependencies: Pure TypeScript, no Zod/Joi/Yup
 *
 * DESIGN DECISIONS:
 * 1. **Why build custom validation vs Zod?**
 *    Zero dependencies. Full control over errors and behavior.
 *    Smaller bundle. Easier to audit and customize.
 *    Educational: Shows validation is not complex.
 *
 * 2. **Why rule-based architecture?**
 *    Composable. Rules are pure functions (input → boolean/error).
 *    Extensible. Custom rules via { type: "custom" }.
 *    Testable. Each rule tests one constraint.
 *
 * 3. **Why ValidationError class?**
 *    Rich context: field name, value, violated rule.
 *    Type-safe error handling via instanceof.
 *    Better debugging with structured information.
 *
 * 4. **Why separate optional from rules?**
 *    Clarity. Optional is not a validation rule, it's a requirement.
 *    Schema: { rules: [...], optional: true } reads clearly.
 *
 * 5. **Why store in ctx.state.body?**
 *    Integration with parsers. Parsers put data here.
 *    Consistent interface. Handlers read from one location.
 *
 * SECURITY CONSIDERATIONS:
 * - No eval or code execution (custom rules are functions, not strings)
 * - Type checking prevents injection attacks
 * - Size limits on strings/arrays prevent DoS
 * - Email/URL validation uses safe regex (no ReDoS)
 * - Error messages don't leak sensitive data
 * - Validation happens after parsing (defense in depth)
 *
 * USAGE:
 * ```typescript
 * import { validator, requiredString, requiredEmail, optionalNumber } from "./validation.ts";
 *
 * // Define schema
 * const createUserSchema = {
 *   name: requiredString({ minLength: 2, maxLength: 50 }),
 *   email: requiredEmail(),
 *   age: optionalNumber({ min: 0, max: 120, integer: true }),
 *   role: {
 *     rules: [
 *       { type: "required" },
 *       { type: "enum", values: ["user", "admin", "moderator"] }
 *     ]
 *   }
 * };
 *
 * // Use as middleware
 * app.post("/users", validator(createUserSchema), (ctx) => {
 *   const user = ctx.state.body; // Validated data
 *   return json({ created: true });
 * });
 * ```
 *
 * VALIDATION PATTERNS:
 *
 * **Pattern 1: Required fields**
 * ```typescript
 * const schema = {
 *   username: requiredString({ minLength: 3, maxLength: 20 }),
 *   password: requiredString({ minLength: 8 }),
 *   email: requiredEmail(),
 * };
 * ```
 *
 * **Pattern 2: Optional with defaults**
 * ```typescript
 * const schema = {
 *   page: optionalNumber({ min: 1, integer: true, default: 1 }),
 *   limit: optionalNumber({ min: 1, max: 100, integer: true, default: 10 }),
 *   sortBy: optionalString({ default: "createdAt" }),
 * };
 * ```
 *
 * **Pattern 3: Nested objects**
 * ```typescript
 * const schema = {
 *   user: {
 *     rules: [{
 *       type: "object",
 *       properties: {
 *         name: requiredString(),
 *         age: requiredNumber({ min: 0 })
 *       }
 *     }]
 *   }
 * };
 * ```
 *
 * **Pattern 4: Arrays with validation**
 * ```typescript
 * const schema = {
 *   tags: requiredArray({
 *     minItems: 1,
 *     maxItems: 10,
 *     items: requiredString({ maxLength: 20 })
 *   })
 * };
 * ```
 *
 * **Pattern 5: Custom validation**
 * ```typescript
 * const schema = {
 *   password: {
 *     rules: [
 *       { type: "required" },
 *       { type: "string", minLength: 8 },
 *       {
 *         type: "custom",
 *         validate: (value) => {
 *           const hasUpper = /[A-Z]/.test(value as string);
 *           const hasLower = /[a-z]/.test(value as string);
 *           const hasDigit = /[0-9]/.test(value as string);
 *           if (!hasUpper || !hasLower || !hasDigit) {
 *             return "Password must contain uppercase, lowercase, and digit";
 *           }
 *           return true;
 *         }
 *       }
 *     ]
 *   }
 * };
 * ```
 *
 * VALIDATION RULES:
 * - required: Field must exist and not be empty
 * - string: Must be string, optional minLength/maxLength/pattern
 * - number: Must be number, optional min/max/integer
 * - boolean: Must be boolean
 * - array: Must be array, optional minItems/maxItems/items schema
 * - object: Must be object, optional properties schema
 * - email: Must be valid email format
 * - url: Must be valid URL
 * - enum: Must be one of specified values
 * - custom: Custom validation function
 *
 * ERROR RESPONSES:
 * Validation errors return 400 Bad Request with structured errors:
 * ```json
 * {
 *   "error": "Validation Error",
 *   "message": "Field 'email' must be a valid email address",
 *   "field": "email",
 *   "rule": "email"
 * }
 * ```
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Validation is synchronous (no async operations)
 * - Rules evaluated in order (short-circuit on first failure)
 * - No expensive regex (email/URL patterns are simple)
 * - Validation happens once per request (after parsing)
 * - Nested validation recurses only when needed
 *
 * VALIDATION VS SANITIZATION:
 * - Validation: Check if data meets criteria (this module)
 * - Sanitization: Transform data to safe format (separate concern)
 * - Use both: Validate structure, sanitize before storage
 * - Example: Validate email format, sanitize HTML before rendering
 *
 * HELPER FUNCTIONS:
 * - requiredString(): String field with constraints
 * - optionalString(): Optional string with default
 * - requiredNumber(): Number field with constraints
 * - optionalNumber(): Optional number with default
 * - requiredBoolean(): Boolean field
 * - optionalBoolean(): Optional boolean with default
 * - requiredEmail(): Email field
 * - requiredUrl(): URL field
 * - requiredEnum(): Enum field with allowed values
 * - requiredArray(): Array field with item validation
 *
 * TESTING STRATEGIES:
 * - Unit test each validation rule independently
 * - Test edge cases (empty strings, 0, false, null, undefined)
 * - Test custom validators with various inputs
 * - Test nested object validation
 * - Test array validation with min/max items
 * - Integration test with middleware and handlers
 *
 * EXTENSIBILITY:
 * Custom validation rules via { type: "custom", validate: (value) => boolean | string }
 * Custom error messages via returning string from validate function
 * Custom types via extending ValidationRule union type
 *
 * RELATED:
 * - See: ./parsers.ts - Body parsing happens before validation
 * - See: ./middleware.ts - Middleware composition patterns
 * - See: ./context.ts - ctx.state.body storage location
 * - See: meta-documentation.md - Security-first development
 *
 * @module core/validation
 */

import type { Context, Middleware } from "./types.ts";
import { ConsoleStyler } from "../core/console.ts";
import { json, badRequest } from "./response.ts";

/**
 * Validation error with field-specific details
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown,
    public rule: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validation rule types
 */
export type ValidationRule =
  | { type: "required" }
  | { type: "string"; minLength?: number; maxLength?: number; pattern?: RegExp }
  | { type: "number"; min?: number; max?: number; integer?: boolean }
  | { type: "boolean" }
  | {
    type: "array";
    items?: ValidationSchema;
    minItems?: number;
    maxItems?: number;
  }
  | { type: "object"; properties?: Record<string, ValidationSchema> }
  | { type: "email" }
  | { type: "url" }
  | { type: "enum"; values: unknown[] }
  | { type: "custom"; validate: (value: unknown) => boolean | string };

/**
 * Validation schema for a field
 */
export interface ValidationSchema {
  rules: ValidationRule[];
  optional?: boolean;
  default?: unknown;
}

/**
 * Schema definition for validation
 */
export type Schema = Record<string, ValidationSchema>;

/**
 * Validate a value against a single rule
 */
function validateRule(
  field: string,
  value: unknown,
  rule: ValidationRule,
): void {
  switch (rule.type) {
    case "required":
      if (value === undefined || value === null || value === "") {
        throw new ValidationError(
          `Field "${field}" is required`,
          field,
          value,
          "required",
        );
      }
      break;

    case "string":
      if (typeof value !== "string") {
        throw new ValidationError(
          `Field "${field}" must be a string`,
          field,
          value,
          "string",
        );
      }
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        throw new ValidationError(
          `Field "${field}" must be at least ${rule.minLength} characters`,
          field,
          value,
          "minLength",
        );
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        throw new ValidationError(
          `Field "${field}" must be at most ${rule.maxLength} characters`,
          field,
          value,
          "maxLength",
        );
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        throw new ValidationError(
          `Field "${field}" does not match required pattern`,
          field,
          value,
          "pattern",
        );
      }
      break;

    case "number":
      if (typeof value !== "number" || isNaN(value)) {
        throw new ValidationError(
          `Field "${field}" must be a number`,
          field,
          value,
          "number",
        );
      }
      if (rule.integer && !Number.isInteger(value)) {
        throw new ValidationError(
          `Field "${field}" must be an integer`,
          field,
          value,
          "integer",
        );
      }
      if (rule.min !== undefined && value < rule.min) {
        throw new ValidationError(
          `Field "${field}" must be at least ${rule.min}`,
          field,
          value,
          "min",
        );
      }
      if (rule.max !== undefined && value > rule.max) {
        throw new ValidationError(
          `Field "${field}" must be at most ${rule.max}`,
          field,
          value,
          "max",
        );
      }
      break;

    case "boolean":
      if (typeof value !== "boolean") {
        throw new ValidationError(
          `Field "${field}" must be a boolean`,
          field,
          value,
          "boolean",
        );
      }
      break;

    case "array":
      if (!Array.isArray(value)) {
        throw new ValidationError(
          `Field "${field}" must be an array`,
          field,
          value,
          "array",
        );
      }
      if (rule.minItems !== undefined && value.length < rule.minItems) {
        throw new ValidationError(
          `Field "${field}" must have at least ${rule.minItems} items`,
          field,
          value,
          "minItems",
        );
      }
      if (rule.maxItems !== undefined && value.length > rule.maxItems) {
        throw new ValidationError(
          `Field "${field}" must have at most ${rule.maxItems} items`,
          field,
          value,
          "maxItems",
        );
      }
      if (rule.items) {
        value.forEach((item, index) => {
          validateValue(`${field}[${index}]`, item, rule.items!);
        });
      }
      break;

    case "object":
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new ValidationError(
          `Field "${field}" must be an object`,
          field,
          value,
          "object",
        );
      }
      if (rule.properties) {
        for (const [key, schema] of Object.entries(rule.properties)) {
          const nestedValue = (value as Record<string, unknown>)[key];
          validateValue(`${field}.${key}`, nestedValue, schema);
        }
      }
      break;

    case "email":
      if (typeof value !== "string") {
        throw new ValidationError(
          `Field "${field}" must be a string`,
          field,
          value,
          "email",
        );
      }
      // Simple email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new ValidationError(
          `Field "${field}" must be a valid email address`,
          field,
          value,
          "email",
        );
      }
      break;

    case "url":
      if (typeof value !== "string") {
        throw new ValidationError(
          `Field "${field}" must be a string`,
          field,
          value,
          "url",
        );
      }
      try {
        new URL(value);
      } catch {
        throw new ValidationError(
          `Field "${field}" must be a valid URL`,
          field,
          value,
          "url",
        );
      }
      break;

    case "enum":
      if (!rule.values.includes(value)) {
        throw new ValidationError(
          `Field "${field}" must be one of: ${rule.values.join(", ")}`,
          field,
          value,
          "enum",
        );
      }
      break;

    case "custom":
      const result = rule.validate(value);
      if (result !== true) {
        const message = typeof result === "string"
          ? result
          : `Field "${field}" failed custom validation`;
        throw new ValidationError(message, field, value, "custom");
      }
      break;
  }
}

/**
 * Validate a value against a schema
 */
function validateValue(
  field: string,
  value: unknown,
  schema: ValidationSchema,
): unknown {
  // Handle optional fields
  if (value === undefined || value === null) {
    if (schema.optional) {
      return schema.default !== undefined ? schema.default : value;
    }
  }

  // Apply all rules
  for (const rule of schema.rules) {
    validateRule(field, value, rule);
  }

  return value;
}

/**
 * Validate an object against a schema
 */
export function validate(
  data: unknown,
  schema: Schema,
): Record<string, unknown> {
  if (typeof data !== "object" || data === null) {
    throw new ValidationError(
      "Data must be an object",
      "root",
      data,
      "object",
    );
  }

  const validated: Record<string, unknown> = {};
  const dataObj = data as Record<string, unknown>;

  // Validate each field in schema
  for (const [field, fieldSchema] of Object.entries(schema)) {
    const value = dataObj[field];
    validated[field] = validateValue(field, value, fieldSchema);
  }

  return validated;
}

/**
 * Validation middleware
 * Validates ctx.state.body against a schema
 *
 * @param schema - Validation schema
 * @param options - Validation options
 */
export function validator(
  schema: Schema,
  options: {
    stripUnknown?: boolean;
  } = {},
): Middleware {
  return async (ctx: Context, next: () => Promise<Response | undefined>) => {
    try {
      const body = ctx.state.body;

      if (!body) {
        ConsoleStyler.logWarning("No body to validate", {
          method: ctx.request.method,
          path: ctx.url.pathname,
        });
        return badRequest("Request body is required");
      }

      // Validate the body
      const validated = validate(body, schema);

      // Strip unknown fields if requested
      if (options.stripUnknown) {
        ctx.state.body = validated;
      } else {
        // Merge validated with original to keep unknown fields
        ctx.state.body = { ...body, ...validated };
      }

      ConsoleStyler.logDebug("Validation passed", {
        fields: Object.keys(validated).length,
      });

      return await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        ConsoleStyler.logWarning("Validation failed", {
          field: error.field,
          rule: error.rule,
          message: error.message,
        });

        return json({
          error: "Validation Error",
          message: error.message,
          field: error.field,
          rule: error.rule,
        }, { status: 400 });
      }

      // Re-throw non-validation errors
      throw error;
    }
  };
}

/**
 * Helper to create a required string field
 */
export function requiredString(
  options: { minLength?: number; maxLength?: number; pattern?: RegExp } = {},
): ValidationSchema {
  return {
    rules: [
      { type: "required" },
      { type: "string", ...options },
    ],
  };
}

/**
 * Helper to create an optional string field
 */
export function optionalString(
  options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    default?: string;
  } = {},
): ValidationSchema {
  const { default: defaultValue, ...ruleOptions } = options;
  return {
    rules: [{ type: "string", ...ruleOptions }],
    optional: true,
    default: defaultValue,
  };
}

/**
 * Helper to create a required number field
 */
export function requiredNumber(
  options: { min?: number; max?: number; integer?: boolean } = {},
): ValidationSchema {
  return {
    rules: [
      { type: "required" },
      { type: "number", ...options },
    ],
  };
}

/**
 * Helper to create an optional number field
 */
export function optionalNumber(
  options: { min?: number; max?: number; integer?: boolean; default?: number } =
    {},
): ValidationSchema {
  const { default: defaultValue, ...ruleOptions } = options;
  return {
    rules: [{ type: "number", ...ruleOptions }],
    optional: true,
    default: defaultValue,
  };
}

/**
 * Helper to create a required boolean field
 */
export function requiredBoolean(): ValidationSchema {
  return {
    rules: [
      { type: "required" },
      { type: "boolean" },
    ],
  };
}

/**
 * Helper to create an optional boolean field
 */
export function optionalBoolean(defaultValue?: boolean): ValidationSchema {
  return {
    rules: [{ type: "boolean" }],
    optional: true,
    default: defaultValue,
  };
}

/**
 * Helper to create a required email field
 */
export function requiredEmail(): ValidationSchema {
  return {
    rules: [
      { type: "required" },
      { type: "email" },
    ],
  };
}

/**
 * Helper to create a required URL field
 */
export function requiredUrl(): ValidationSchema {
  return {
    rules: [
      { type: "required" },
      { type: "url" },
    ],
  };
}

/**
 * Helper to create an enum field
 */
export function requiredEnum(values: unknown[]): ValidationSchema {
  return {
    rules: [
      { type: "required" },
      { type: "enum", values },
    ],
  };
}

/**
 * Helper to create a required array field
 */
export function requiredArray(
  options: { items?: ValidationSchema; minItems?: number; maxItems?: number } =
    {},
): ValidationSchema {
  return {
    rules: [
      { type: "required" },
      { type: "array", ...options },
    ],
  };
}
