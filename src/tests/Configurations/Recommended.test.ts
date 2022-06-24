import { RecommendedConfigTests } from "./RecommendedConfigTests.js";

/**
 * Registers tests for the `Recommended` configuration.
 */
export function RecommendedTests(): void
{
    suite(
        "Testing recommended configuration…",
        () =>
        {
            new RecommendedConfigTests().Register();
        });
}
