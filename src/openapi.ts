export default {
  "components": {
    "schemas": {
      "App": {
        "properties": {
          "name": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "url"
        ],
        "type": "object"
      },
      "Config": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "properties": {
          "cert": {
            "type": "string"
          },
          "customDomains": {
            "additionalProperties": {
              "type": "string"
            },
            "type": "object"
          },
          "dir": {
            "type": "string"
          },
          "domain": {
            "type": "string"
          },
          "editor": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "env": {
            "additionalProperties": {
              "type": "string"
            },
            "type": "object"
          },
          "host": {
            "type": "string"
          },
          "key": {
            "type": "string"
          },
          "port": {
            "type": "integer"
          },
          "shell": {
            "type": "string"
          }
        },
        "type": "object"
      },
      "ConsoleLog": {
        "additionalProperties": false,
        "properties": {
          "app": {
            "description": "The name of the application",
            "type": "string"
          },
          "level": {
            "description": "The log level",
            "enum": [
              "INFO",
              "WARN",
              "ERROR",
              "DEBUG"
            ],
            "type": "string"
          },
          "msg": {
            "description": "The log message",
            "type": "string"
          },
          "text": {
            "description": "The standard error of the command",
            "type": "string"
          },
          "time": {
            "description": "The timestamp of the log entry",
            "format": "date-time",
            "type": "string"
          },
          "type": {
            "enum": [
              "stdout",
              "stderr"
            ],
            "type": "string"
          }
        },
        "required": [
          "time",
          "level",
          "app",
          "msg",
          "type",
          "text"
        ],
        "type": "object"
      },
      "CronLog": {
        "additionalProperties": false,
        "properties": {
          "app": {
            "description": "The name of the application running the cron job",
            "type": "string"
          },
          "args": {
            "description": "The arguments passed to the cron job",
            "items": {
              "type": "string"
            },
            "type": "array"
          },
          "duration": {
            "description": "The duration of the cron job execution in milliseconds",
            "minimum": 0,
            "type": "integer"
          },
          "exit_code": {
            "description": "The exit code of the cron job",
            "type": "integer"
          },
          "id": {
            "description": "A unique identifier for the cron job, typically in the format 'app:job'",
            "type": "string"
          },
          "job": {
            "description": "The name of the cron job",
            "type": "string"
          },
          "level": {
            "description": "The log level",
            "enum": [
              "INFO",
              "WARN",
              "ERROR",
              "DEBUG"
            ],
            "type": "string"
          },
          "msg": {
            "description": "The log message, typically including the exit code",
            "type": "string"
          },
          "schedule": {
            "description": "The schedule of the cron job",
            "type": "string"
          },
          "time": {
            "description": "The timestamp of the log entry",
            "format": "date-time",
            "type": "string"
          },
          "type": {
            "description": "The type of log entry, always 'cron' for this schema",
            "enum": [
              "cron"
            ]
          }
        },
        "required": [
          "time",
          "level",
          "msg",
          "type",
          "id",
          "app",
          "job",
          "schedule",
          "args",
          "exit_code",
          "stdout",
          "stderr",
          "duration"
        ],
        "type": "object"
      },
      "HttpLog": {
        "additionalProperties": false,
        "properties": {
          "level": {
            "description": "The log level",
            "enum": [
              "INFO",
              "WARNING",
              "ERROR",
              "DEBUG"
            ],
            "type": "string"
          },
          "msg": {
            "description": "A brief description of the logged event",
            "type": "string"
          },
          "request": {
            "additionalProperties": false,
            "properties": {
              "headers": {
                "additionalProperties": {
                  "type": "string"
                },
                "description": "The headers sent with the request",
                "type": "object"
              },
              "host": {
                "description": "The host component of the request URL",
                "type": "string"
              },
              "method": {
                "description": "The HTTP method used for the request",
                "enum": [
                  "GET",
                  "POST",
                  "PUT",
                  "DELETE",
                  "PATCH",
                  "HEAD",
                  "OPTIONS"
                ],
                "type": "string"
              },
              "path": {
                "description": "The path component of the request URL",
                "type": "string"
              },
              "url": {
                "description": "The full URL of the request",
                "format": "uri",
                "type": "string"
              }
            },
            "required": [
              "url",
              "host",
              "method",
              "path",
              "headers"
            ],
            "type": "object"
          },
          "response": {
            "additionalProperties": false,
            "properties": {
              "bytes": {
                "description": "The number of bytes in the response body",
                "minimum": 0,
                "type": "integer"
              },
              "elapsed": {
                "description": "The time taken to process the request and generate the response, in seconds",
                "minimum": 0,
                "type": "number"
              },
              "status": {
                "description": "The HTTP status code of the response",
                "maximum": 599,
                "minimum": 100,
                "type": "integer"
              }
            },
            "required": [
              "status",
              "bytes",
              "elapsed"
            ],
            "type": "object"
          },
          "time": {
            "description": "The time when the log entry was created",
            "format": "date-time",
            "type": "string"
          }
        },
        "required": [
          "time",
          "level",
          "msg",
          "request",
          "response"
        ],
        "type": "object"
      },
      "schemas_app": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "properties": {
          "crons": {
            "description": "Set of cron jobs",
            "items": {
              "properties": {
                "args": {
                  "description": "Arguments to pass to the script",
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                },
                "description": {
                  "description": "Description of the cron job",
                  "type": "string"
                },
                "name": {
                  "description": "Name of the cron job",
                  "type": "string"
                },
                "schedule": {
                  "description": "Cron schedule",
                  "type": "string"
                }
              },
              "required": [
                "name",
                "schedule",
                "args"
              ],
              "type": "object"
            },
            "type": "array"
          },
          "entrypoint": {
            "type": "string"
          },
          "private": {
            "type": "boolean"
          },
          "privateRoutes": {
            "items": {
              "type": "string"
            },
            "type": "array"
          },
          "publicRoutes": {
            "items": {
              "type": "string"
            },
            "type": "array"
          },
          "root": {
            "type": "string"
          }
        },
        "type": "object"
      }
    }
  },
  "info": {
    "title": "Smallweb API",
    "version": "0"
  },
  "openapi": "3.0.3",
  "paths": {
    "/v0/apps": {
      "get": {
        "operationId": "GetV0Apps",
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "items": {
                    "$ref": "#/components/schemas/App"
                  },
                  "type": "array"
                }
              }
            },
            "description": "List of apps"
          }
        }
      }
    },
    "/v0/apps/{app}/config": {
      "get": {
        "operationId": "GetV0AppsAppConfig",
        "parameters": [
          {
            "in": "path",
            "name": "app",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/schemas_app"
                }
              }
            },
            "description": "Get app config"
          }
        }
      }
    },
    "/v0/apps/{app}/env": {
      "get": {
        "operationId": "GetV0AppsAppEnv",
        "parameters": [
          {
            "in": "path",
            "name": "app",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "additionalProperties": {
                    "type": "string"
                  },
                  "type": "object"
                }
              }
            },
            "description": "Get app env"
          }
        }
      }
    },
    "/v0/config": {
      "get": {
        "operationId": "GetV0Config",
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Config"
                }
              }
            },
            "description": "Get config"
          }
        }
      }
    },
    "/v0/logs/console": {
      "get": {
        "operationId": "GetV0LogsConsole",
        "parameters": [
          {
            "description": "Filter logs by app",
            "in": "query",
            "name": "app",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "content": {
              "text/event-stream": {
                "schema": {
                  "$ref": "#/components/schemas/ConsoleLog"
                }
              }
            },
            "description": "Stream logs"
          }
        }
      }
    },
    "/v0/logs/cron": {
      "get": {
        "operationId": "GetV0LogsCron",
        "parameters": [
          {
            "description": "Filter logs by app",
            "in": "query",
            "name": "app",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "content": {
              "text/event-stream": {
                "schema": {
                  "$ref": "#/components/schemas/CronLog"
                }
              }
            },
            "description": "Stream logs"
          }
        }
      }
    },
    "/v0/logs/http": {
      "get": {
        "operationId": "GetV0LogsHttp",
        "parameters": [
          {
            "description": "Filter logs by host",
            "in": "query",
            "name": "host",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "content": {
              "text/event-stream": {
                "schema": {
                  "$ref": "#/components/schemas/HttpLog"
                }
              }
            },
            "description": "Stream logs"
          }
        }
      }
    },
    "/v0/run/{app}": {
      "post": {
        "operationId": "PostV0RunApp",
        "parameters": [
          {
            "in": "path",
            "name": "app",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "properties": {
                  "args": {
                    "items": {
                      "type": "string"
                    },
                    "type": "array"
                  }
                },
                "required": [
                  "args"
                ],
                "type": "object"
              }
            }
          }
        },
        "responses": {
          "200": {
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            },
            "description": "Run app cli",
            "headers": {
              "Content-Type": {
                "schema": {
                  "type": "string"
                }
              },
              "X-Exit-Code": {
                "schema": {
                  "type": "integer"
                }
              }
            }
          }
        }
      }
    }
  }
} as const;
