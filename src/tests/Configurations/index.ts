import { RecommendedTests } from "./Recommended.test";

/**
 * Registers tests for `Configuration`-components.
 */
export function ConfigurationTests(): void
{
    suite(
        "Configurations",
        () =>
        {
            RecommendedTests();
        });
}
