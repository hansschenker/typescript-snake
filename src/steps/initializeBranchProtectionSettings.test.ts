import { Octokit } from "octokit";
import { MockInstance, describe, expect, it, vi } from "vitest";

import { initializeBranchProtectionSettings } from "./initializeGitHubRepository/initializeBranchProtectionSettings.js";

const createMockOctokit = (request: MockInstance) =>
	({
		request,
	}) as unknown as Octokit;

const stubValues = { owner: "", repository: "" };

describe("migrateBranchProtectionSettings", () => {
	it("does not throw when the request receives a non-error response", async () => {
		const mockRequest = vi.fn().mockResolvedValue({ status: 200 });

		await expect(
			initializeBranchProtectionSettings(
				createMockOctokit(mockRequest),
				stubValues,
			),
		).resolves.not.toThrow();
	});

	it("returns false when the request receives a 403 response", async () => {
		const mockRequest = vi.fn().mockRejectedValue({ status: 403 });

		const actual = await initializeBranchProtectionSettings(
			createMockOctokit(mockRequest),
			stubValues,
		);

		expect(actual).toBe(false);
	});

	it("throws the error when the request throws with a non-403 response", async () => {
		const error = { status: 404 };
		const mockRequest = vi.fn().mockRejectedValue(error);

		await expect(() =>
			initializeBranchProtectionSettings(
				createMockOctokit(mockRequest),
				stubValues,
			),
		).rejects.toBe(error);
	});
});
