export const schema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["title", "year", "studios", "producers"],
    properties: {
      name: {
        bsonType: "string",
        description: "title must be a string and is required"
      },
      year: {
        bsonType: "int",
        minimum: 1900,
        maximum: 3017,
        description: "'year' must be an integer in [ 1900, 3017 ] and is required"
      },
      studios: {
        bsonType: ["array"],
        items: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        description: "studios must be a list of string and is required"
      },
      producers: {
        bsonType: ["array"],
        items: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        description: "producers must be a list of string and is required"
      },
      winner: {
        bsonType: "int",
        minimum: 0,
        maximum: 1,
        description: "flag winner"
      }
    }
  }
};
