import { validateMessage, validateAuthor, LIMITS } from "@/lib/validation";

describe("validateMessage", () => {
    it("rejects empty and whitespace-only input", () => {
        expect(validateMessage("")).toBe("Message cannot be empty");
        expect(validateMessage("   ")).toBe("Message cannot be empty");
    });

    it("accepts messages within limit", () => {
        expect(validateMessage("hello")).toBeNull();
        expect(validateMessage("a".repeat(LIMITS.message.max))).toBeNull();
    });

    it("rejects messages over max length", () => {
        expect(validateMessage("a".repeat(LIMITS.message.max + 1))).toContain(`${LIMITS.message.max}`);
    });
});

describe("validateAuthor", () => {
    it("rejects empty name", () => {
        expect(validateAuthor("")).toBe("Name cannot be empty");
    });

    it("accepts valid names including hyphens and spaces", () => {
        expect(validateAuthor("Martin")).toBeNull();
        expect(validateAuthor("Mary-Jane Watson")).toBeNull();
        expect(validateAuthor("user_42")).toBeNull();
    });

    it("rejects names over max length", () => {
        expect(validateAuthor("x".repeat(LIMITS.author.max + 1))).toContain(`${LIMITS.author.max}`);
    });

    it("rejects names with special characters", () => {
        expect(validateAuthor("john@doe")).not.toBeNull();
        expect(validateAuthor("a<b>c")).not.toBeNull();
    });
});
