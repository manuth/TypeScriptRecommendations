/**
 * Represents a test for a linting-rule.
 */
export interface IRuleTest
{
    /**
     * The tag-line of the test.
     */
    RuleName: string;

    /**
     * A set of valid code-snippets.
     */
    ValidCode?: string[];

    /**
     * A set of invalid code-snippets.
     */
    InvalidCode?: string[];

    /**
     * A procedure which is launched before the test.
     */
    Preprocess?: () => void;

    /**
     * A procedure which is launched after the test.
     */
    Postprocess?: () => void;
}
