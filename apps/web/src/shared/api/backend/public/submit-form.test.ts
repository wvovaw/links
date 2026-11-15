import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ api: vi.fn() }));

vi.mock("../client", () => ({ useApiClient: () => mocks.api }));

import { submitForm } from "./submit-form";

/** The body the client handed the API client on its last call. */
function lastBody() {
  return mocks.api.mock.calls.at(-1)?.[1]?.body;
}

describe("submitForm", () => {
  beforeEach(() => {
    mocks.api.mockReset();
    mocks.api.mockResolvedValue({ ok: true });
  });

  /*
    The page's slug is a URL segment. The endpoint runs `whitelist` + `forbidNonWhitelisted`, so a body that
    repeats it answers 400 and every real visitor's message is lost — the defect the component tests missed by
    mocking this module and the API suite missed by posting to the route itself.
  */
  it("posts the DTO's fields, without the slug", async () => {
    await submitForm({
      slug: "my-page",
      blockId: "b1",
      kind: "contact",
      email: "ada@example.com",
      name: "Ada",
      message: "Hello there",
      company: "",
    });

    const body = lastBody();

    expect(mocks.api.mock.calls.at(-1)?.[0]).toBe("/public/links/my-page/submissions");
    expect(body).toEqual({
      blockId: "b1",
      kind: "contact",
      email: "ada@example.com",
      name: "Ada",
      message: "Hello there",
      company: "",
    });
    expect(body).not.toHaveProperty("slug");
  });

  /* The same rule for the ends of the input that are not body fields at all. */
  it("sends no field the endpoint does not name, and no undefined ones", async () => {
    await submitForm({ slug: "my-page", blockId: "b2", kind: "subscribe", email: "ada@example.com" });

    expect(lastBody()).toEqual({ blockId: "b2", kind: "subscribe", email: "ada@example.com" });
  });
});
