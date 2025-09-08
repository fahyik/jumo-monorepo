import { log } from "..";

jest.spyOn(global.console, "log");

describe("@jumo-monorepo/logger", () => {
  it("prints a message", () => {
    log("hello");
    expect(console.log).toHaveBeenCalled();
  });
});
