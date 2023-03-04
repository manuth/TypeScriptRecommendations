import { strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import npmWhich from "npm-which";
import { IRuleTest } from "./IRuleTest.js";
import { TSConfigSuite } from "./TSConfigSuite.js";

const { writeFile } = fs;

/**
 * Provides the functionality to test a tsconfig rule.
 */
export class RuleSuite extends TSConfigSuite
{
    /**
     * The test to perform.
     */
    private ruleTest: IRuleTest;

    /**
     * The parent suite of this suite.
     */
    private parentSuite: TSConfigSuite;

    /**
     * Gets the test to perform.
     */
    protected get RuleTest(): IRuleTest
    {
        return this.ruleTest;
    }

    /**
     * @inheritdoc
     */
    protected get Title(): string
    {
        return `Checking the integrity of the \`${this.RuleTest.RuleName}\`-rule…`;
    }

    /**
     * Gets the parent suite of this suite.
     */
    protected get ParentSuite(): TSConfigSuite
    {
        return this.parentSuite;
    }

    /**
     * @inheritdoc
     */
    public get ConfigPath(): string
    {
        return this.ParentSuite.ConfigPath;
    }

    /**
     * Registers the tests.
     */
    protected override RegisterInternal(): void
    {
        let self = this;

        if (this.RuleTest.ValidCode)
        {
            test(
                "Testing valid code-snippets…",
                async function()
                {
                    this.slow(30 * 1000);
                    this.timeout(60 * 1000);
                    await self.TestCode(self.RuleTest.ValidCode, false);
                });
        }

        if (this.RuleTest.InvalidCode)
        {
            test(
                "Testing invalid code-snippets…",
                async function()
                {
                    this.slow(30 * 1000);
                    this.timeout(60 * 1000);
                    await self.TestCode(self.RuleTest.InvalidCode, true);
                });
        }
    }

    /**
     * @inheritdoc
     */
    protected override async SuiteSetup(): Promise<void>
    {
        await super.SuiteSetup();

        if (this.RuleTest.Preprocess)
        {
            this.RuleTest.Preprocess();
        }
    }

    /**
     * @inheritdoc
     */
    protected override async SuiteTeardown(): Promise<void>
    {
        await super.SuiteTeardown();

        if (this.RuleTest.Postprocess)
        {
            this.RuleTest.Postprocess();
        }
    }

    /**
     * Tests code-snippets for errors.
     *
     * @param codeSnippets
     * The code-snippets to test.
     *
     * @param error
     * A value indicating whether an error is expected.
     */
    protected async TestCode(codeSnippets: string[], error: boolean): Promise<void>
    {
        for (let codeSnippet of codeSnippets)
        {
            strictEqual((await this.ProcessCode(codeSnippet)) !== 0, error);
        }
    }

    /**
     * Tests the specified {@link code `code`} using `tsc`.
     *
     * @param code
     * The code to test.
     *
     * @returns
     * The exit-code of the test.
     */
    protected async ProcessCode(code: string): Promise<number>
    {
        await writeFile(this.TempDir.MakePath("index.ts"), code);

        return spawnSync(
            npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("tsc"),
            ["-p", this.TempDir.MakePath()]).status;
    }
}
