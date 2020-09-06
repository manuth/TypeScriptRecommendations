import { RecommendedConfigTests } from "./RecommendedConfigTests";

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
