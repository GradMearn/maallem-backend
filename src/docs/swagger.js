const { PORT } = require("../config/env");

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Maallem API",
    version: "1.0.0",
    description:
      "Maallem backend — Authentication & Profiles (Worker / Company).\n\n" +
      "**Auth:** Register/login, refresh token, profile (`/me`).\n\n" +
      "**Profiles:** Public listing by ID; worker/company manage their profile via `/worker/me` and `/company/me` (multipart for images).",
    contact: {
      name: "Maallem Team",
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api/v1`,
      description: "API v1 (recommended)",
    },
    {
      url: `http://localhost:${PORT}/api`,
      description: "API alias (same routes, without v1)",
    },
  ],
  tags: [
    { name: "Auth", description: "Registration, login, tokens" },
    { name: "Profiles - Workers (Public)", description: "No authentication required" },
    { name: "Profiles - Companies (Public)", description: "No authentication required" },
    { name: "Profiles - Worker (Me)", description: "Worker role + Bearer token" },
    { name: "Profiles - Company (Me)", description: "Company role + Bearer token" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Paste accessToken from login/register response",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
        },
      },
      Location: {
        type: "object",
        properties: {
          address: { type: "string", example: "شارع التحرير، المعادي" },
          city: { type: "string", example: "القاهرة" },
        },
      },
      UserPublic: {
        type: "object",
        properties: {
          _id: { type: "string", example: "674a1b2c3d4e5f6789012345" },
          name: { type: "string", example: "أحمد محمد" },
          email: { type: "string", example: "worker@mail.com" },
          role: { type: "string", enum: ["user", "worker", "company"] },
        },
      },
      User: {
        allOf: [
          { $ref: "#/components/schemas/UserPublic" },
          {
            type: "object",
            properties: {
              phone: { type: "string", example: "01012345678" },
              isVerified: { type: "boolean", example: false },
              isActive: { type: "boolean", example: true },
              workerProfile: { type: "string", nullable: true },
              companyProfile: { type: "string", nullable: true },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        ],
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "phone", "password", "confirmPassword"],
        properties: {
          name: { type: "string", minLength: 2, example: "أحمد محمد" },
          email: { type: "string", format: "email", example: "worker@mail.com" },
          phone: { type: "string", pattern: "^[0-9]{10,15}$", example: "01012345678" },
          password: { type: "string", minLength: 8, example: "password123" },
          confirmPassword: { type: "string", example: "password123" },
          role: {
            type: "string",
            enum: ["user", "worker", "company"],
            default: "user",
            example: "worker",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "worker@mail.com" },
          password: { type: "string", example: "password123" },
        },
      },
      RefreshTokenRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        },
      },
      LogoutRequest: {
        type: "object",
        properties: {
          refreshToken: {
            type: "string",
            description: "Optional — removes specific refresh token from device",
          },
        },
      },
      AuthTokensData: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
        },
      },
      WorkerProfile: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/UserPublic" },
          avatar: { type: "string", format: "uri", example: "https://res.cloudinary.com/.../avatar.jpg" },
          bio: { type: "string", example: "فني سباكة وكهرباء..." },
          experience: { type: "string", example: "8 سنوات خبرة" },
          specializations: {
            type: "array",
            items: { type: "string" },
            example: ["سباكة", "كهرباء", "صيانة عامة"],
          },
          location: { $ref: "#/components/schemas/Location" },
          phone: { type: "string", example: "01098765432" },
          portfolioImages: {
            type: "array",
            items: { type: "string", format: "uri" },
          },
          isProfileComplete: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CompanyProfile: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/UserPublic" },
          logo: { type: "string", format: "uri" },
          companyName: { type: "string", example: "شركة البناء الحديث" },
          bio: { type: "string", example: "شركة مقاولات عامة..." },
          employeeCount: { type: "integer", example: 25 },
          location: { $ref: "#/components/schemas/Location" },
          contactPhones: {
            type: "array",
            items: { type: "string" },
            example: ["0223456789", "01012345678"],
          },
          projectImages: {
            type: "array",
            items: { type: "string", format: "uri" },
          },
          isProfileComplete: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      WorkerProfileBody: {
        type: "object",
        description: "Use as multipart/form-data fields (text). Arrays can be comma-separated or JSON string.",
        properties: {
          bio: { type: "string" },
          experience: { type: "string" },
          specializations: {
            type: "string",
            description: 'JSON array or comma-separated, e.g. ["سباكة","كهرباء"] or سباكة,كهرباء',
            example: "سباكة,كهرباء,صيانة عامة",
          },
          location: {
            type: "string",
            description: 'JSON object or plain address, e.g. {"address":"...","city":"القاهرة"}',
            example: '{"address":"شارع التحرير","city":"القاهرة"}',
          },
          phone: { type: "string", example: "01098765432" },
          avatar: { type: "string", format: "binary", description: "Profile photo" },
          portfolioImages: {
            type: "array",
            items: { type: "string", format: "binary" },
            description: "Previous work photos (max 10)",
          },
          removePortfolioImages: {
            type: "string",
            description: "URLs to remove (JSON array or single URL) — update only",
          },
        },
      },
      CompanyProfileBody: {
        type: "object",
        description: "Use as multipart/form-data fields (text).",
        properties: {
          companyName: { type: "string", example: "شركة البناء الحديث" },
          bio: { type: "string" },
          employeeCount: { type: "integer", example: 25 },
          location: {
            type: "string",
            example: '{"address":"التجمع الخامس","city":"القاهرة"}',
          },
          contactPhones: {
            type: "string",
            description: 'JSON array or comma-separated, e.g. ["0223456789","01012345678"]',
            example: "0223456789,01012345678",
          },
          logo: { type: "string", format: "binary" },
          projectImages: {
            type: "array",
            items: { type: "string", format: "binary" },
            description: "Previous project photos (max 10)",
          },
          removeProjectImages: {
            type: "string",
            description: "URLs to remove — update only",
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing or invalid token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "Wrong role for this endpoint",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      ValidationError: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Create account with role `user`, `worker`, or `company`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Registered successfully" },
                    data: { $ref: "#/components/schemas/AuthTokensData" },
                  },
                },
              },
            },
          },
          409: { description: "Email already in use" },
          422: { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Logged in successfully" },
                    data: { $ref: "#/components/schemas/AuthTokensData" },
                  },
                },
              },
            },
          },
          401: { description: "Invalid email or password" },
          422: { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Token refreshed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Token refreshed" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string" },
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        description: "Returns user with populated `workerProfile` and `companyProfile` if set.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout (current device)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LogoutRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Logged out",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        message: { example: "Logged out successfully" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/logout-all": {
      post: {
        tags: ["Auth"],
        summary: "Logout from all devices",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Logged out from all devices",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Logged out from all devices" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/profiles/workers": {
      get: {
        tags: ["Profiles - Workers (Public)"],
        summary: "List all worker profiles",
        description: "No authentication required.",
        parameters: [
          {
            name: "city",
            in: "query",
            schema: { type: "string" },
            description: "Filter by city (partial match)",
            example: "القاهرة",
          },
          {
            name: "specialization",
            in: "query",
            schema: { type: "string" },
            description: "Filter by specialization",
            example: "سباكة",
          },
        ],
        responses: {
          200: {
            description: "List of worker profiles",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer" },
                    data: {
                      type: "object",
                      properties: {
                        profiles: {
                          type: "array",
                          items: { $ref: "#/components/schemas/WorkerProfile" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/profiles/workers/{id}": {
      get: {
        tags: ["Profiles - Workers (Public)"],
        summary: "Get worker profile by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Worker profile MongoDB _id",
          },
        ],
        responses: {
          200: {
            description: "Worker profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        profile: { $ref: "#/components/schemas/WorkerProfile" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/profiles/companies": {
      get: {
        tags: ["Profiles - Companies (Public)"],
        summary: "List all company profiles",
        parameters: [
          {
            name: "city",
            in: "query",
            schema: { type: "string" },
            example: "القاهرة",
          },
          {
            name: "name",
            in: "query",
            schema: { type: "string" },
            description: "Filter by company name",
            example: "بناء",
          },
        ],
        responses: {
          200: {
            description: "List of company profiles",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer" },
                    data: {
                      type: "object",
                      properties: {
                        profiles: {
                          type: "array",
                          items: { $ref: "#/components/schemas/CompanyProfile" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/profiles/companies/{id}": {
      get: {
        tags: ["Profiles - Companies (Public)"],
        summary: "Get company profile by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Company profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        profile: { $ref: "#/components/schemas/CompanyProfile" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/profiles/worker/me": {
      post: {
        tags: ["Profiles - Worker (Me)"],
        summary: "Create my worker profile",
        description: "Requires `worker` role. Send as **multipart/form-data** if uploading images.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/WorkerProfileBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Profile created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Worker profile created" },
                    data: {
                      type: "object",
                      properties: {
                        profile: { $ref: "#/components/schemas/WorkerProfile" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          409: { description: "Profile already exists" },
        },
      },
      get: {
        tags: ["Profiles - Worker (Me)"],
        summary: "Get my worker profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "My worker profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        profile: { $ref: "#/components/schemas/WorkerProfile" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Profiles - Worker (Me)"],
        summary: "Update my worker profile (full)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/WorkerProfileBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Worker profile updated" },
                    data: {
                      type: "object",
                      properties: {
                        profile: { $ref: "#/components/schemas/WorkerProfile" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          422: { $ref: "#/components/responses/ValidationError" },
        },
      },
      patch: {
        tags: ["Profiles - Worker (Me)"],
        summary: "Update my worker profile (partial)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/WorkerProfileBody" },
            },
          },
        },
        responses: {
          200: { description: "Profile updated (same as PUT)" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Profiles - Worker (Me)"],
        summary: "Delete my worker profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Worker profile deleted" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/profiles/company/me": {
      post: {
        tags: ["Profiles - Company (Me)"],
        summary: "Create my company profile",
        description: "Requires `company` role. **multipart/form-data** for logo and project images.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CompanyProfileBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Profile created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Company profile created" },
                    data: {
                      type: "object",
                      properties: {
                        profile: { $ref: "#/components/schemas/CompanyProfile" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          409: { description: "Profile already exists" },
        },
      },
      get: {
        tags: ["Profiles - Company (Me)"],
        summary: "Get my company profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "My company profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        profile: { $ref: "#/components/schemas/CompanyProfile" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Profiles - Company (Me)"],
        summary: "Update my company profile (full)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CompanyProfileBody" },
            },
          },
        },
        responses: {
          200: { description: "Profile updated" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Profiles - Company (Me)"],
        summary: "Update my company profile (partial)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CompanyProfileBody" },
            },
          },
        },
        responses: {
          200: { description: "Profile updated" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Profiles - Company (Me)"],
        summary: "Delete my company profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Company profile deleted" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
