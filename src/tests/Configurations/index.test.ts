import { basename } from "path";
import { RecommendedTests } from "./Recommended.test.js";

/**
 * Registers tests for `Configuration`-components.
 */
export function ConfigurationTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            RecommendedTests();
        });
}
