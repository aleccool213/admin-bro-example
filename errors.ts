const INVALID_ADMIN_BRO_INSTANCE =
  "You have to pass an instance of AdminBro to the buildRouter() function";

export class WrongArgumentError extends Error {
  constructor() {
    super(INVALID_ADMIN_BRO_INSTANCE);
    this.name = "WrongArgumentError";
  }
}
