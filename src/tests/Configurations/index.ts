import { basename } from "path";
import { RecommendedTests } from "./Recommended.test";

/**
 * Registers tests for `Configuration`-components.
 */
export function ConfigurationTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            RecommendedTests();
        });
}
