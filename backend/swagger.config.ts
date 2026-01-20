import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pokemon API',
            version: '1.0.0',
            description: 'A RESTful API for managing Pokemon and user favorites',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'User unique identifier',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                        name: {
                            type: 'string',
                            description: 'User name (optional)',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'User creation timestamp',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'password123',
                        },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'password123',
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'JWT authentication token',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
                Pokemon: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Pokemon ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Pokemon name',
                        },
                        types: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    type: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        sprites: {
                            type: 'object',
                            description: 'Pokemon sprites/images',
                        },
                        abilities: {
                            type: 'array',
                            items: {
                                type: 'object',
                            },
                        },
                        stats: {
                            type: 'array',
                            items: {
                                type: 'object',
                            },
                        },
                    },
                },
                PokemonList: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'integer',
                            description: 'Total number of Pokemon',
                        },
                        next: {
                            type: 'string',
                            nullable: true,
                            description: 'URL to next page',
                        },
                        previous: {
                            type: 'string',
                            nullable: true,
                            description: 'URL to previous page',
                        },
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    url: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                Favorite: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        pokemonId: {
                            type: 'integer',
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                AddFavoriteRequest: {
                    type: 'object',
                    required: ['pokemonId'],
                    properties: {
                        pokemonId: {
                            type: 'integer',
                            example: 25,
                            description: 'Pokemon ID to add to favorites',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message',
                        },
                    },
                },
            },
        },
    },
    apis: ['./index.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
