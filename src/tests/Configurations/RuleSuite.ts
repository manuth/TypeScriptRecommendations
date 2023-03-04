import { strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import npmWhich from "npm-which";
import { ICompilationResult } from "./ICompilationResult.js";
import { IRuleTest } from "./IRuleTest.js";
import { TestContext } from "./TestContext.js";
import { TSConfigSuite } from "./TSConfigSuite.js";

const { readFile, writeFile } = fs;

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
     * Initializes a new instance of the {@link RuleSuite `RuleSuite`} class.
     *
     * @param parentSuite
     * The parent of this suite.
     *
     * @param ruleTest
     * The test to perform.
     */
    public constructor(parentSuite: TSConfigSuite, ruleTest: IRuleTest)
    {
        super();
        this.ruleTest = ruleTest;
        this.parentSuite = parentSuite;
    }

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
     *
     * @param context
     * The context of the underlying tests.
     */
    protected override RegisterInternal(context: TestContext): void
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
                    await self.TestCode(context, self.RuleTest.ValidCode, false);
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
                    await self.TestCode(context, self.RuleTest.InvalidCode, true);
                });
        }
    }

    /**
     * @inheritdoc
     *
     * @param context
     * The context of the underlying tests.
     */
    protected override async SuiteSetup(context: TestContext): Promise<void>
    {
        await super.SuiteSetup(context);

        if (this.RuleTest.Preprocess)
        {
            this.RuleTest.Preprocess(context);
        }
    }

    /**
     * @inheritdoc
     *
     * @param context
     * The context of the underlying tests.
     */
    protected override async SuiteTeardown(context: TestContext): Promise<void>
    {
        await super.SuiteTeardown(context);

        if (this.RuleTest.Postprocess)
        {
            this.RuleTest.Postprocess(context);
        }
    }

    /**
     * Tests code-snippets for errors.
     *
     * @param context
     * The context of the underlying tests.
     *
     * @param codeSnippets
     * The code-snippets to test.
     *
     * @param error
     * A value indicating whether an error is expected.
     */
    protected async TestCode(context: TestContext, codeSnippets: string[], error: boolean): Promise<void>
    {
        for (let codeSnippet of codeSnippets)
        {
            strictEqual((await this.CompileCode(context, codeSnippet)).status !== 0, error);
        }
    }

    /**
     * Tests the specified {@link code `code`} using `tsc`.
     *
     * @param context
     * The context of the underlying tests.
     *
     * @param code
     * The code to test.
     *
     * @returns
     * The exit-code of the test.
     */
    protected async CompileCode(context: TestContext, code: string): Promise<ICompilationResult>
    {
        let fileName = "index";
        await writeFile(context.TempDir.MakePath(`${fileName}.ts`), code);

        let result = spawnSync(
            npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("tsc"),
            ["-p", context.TempDir.MakePath()]);

        return {
            status: result.status,
            compiledCode: (await readFile(context.TempDir.MakePath(`${fileName}.js`))).toString()
        };
    }
}
