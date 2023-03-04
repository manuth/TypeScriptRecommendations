import { strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import npmWhich from "npm-which";
import { IRuleTest } from "./IRuleTest.js";
import { TSConfigSuite } from "./TSConfigSuite.js";

const { writeFile } = fs;

/**
 * Provides tests for a typescript-configuration.
 */
export class ConfigurationTests extends TSConfigSuite
{
    /**
     * Gets or sets tests for tsconfig-settings.
     */
    public RuleTests: IRuleTest[] = [];

    /**
     * The path to the configuration to test.
     */
    private configPath: string;

    /**
     * Gets the path to the configuration to test.
     */
    protected override get ConfigPath(): string
    {
        return this.configPath;
    }

    /**
     * @inheritdoc
     */
    protected get Title(): string
    {
        return "Checking the integrity of the config…";
    }

    /**
     * Initializes a new instance of the {@link ConfigurationTests `ConfigurationTests`} class.
     *
     * @param configPath
     * The path to the configuration to test.
     */
    public constructor(configPath: string)
    {
        super();
        this.configPath = configPath;
    }

    /**
     * Registers the tests.
     */
    protected override RegisterInternal(): void
    {
        let self = this;

        for (let ruleTest of this.RuleTests)
        {
            suite(
                "Checking the integrity of the `" + ruleTest.RuleName + "`-rule…",
                () =>
                {
                    if (ruleTest.Preprocess)
                    {
                        suiteSetup(ruleTest.Preprocess);
                    }

                    if (ruleTest.ValidCode)
                    {
                        test(
                            "Testing valid code-snippets…",
                            async function()
                            {
                                this.slow(30 * 1000);
                                this.timeout(60 * 1000);
                                await self.TestCode(ruleTest.ValidCode, false);
                            });
                    }

                    if (ruleTest.InvalidCode)
                    {
                        test(
                            "Testing invalid code-snippets…",
                            async function()
                            {
                                this.slow(30 * 1000);
                                this.timeout(60 * 1000);
                                await self.TestCode(ruleTest.InvalidCode, true);
                            });
                    }

                    if (ruleTest.Postprocess)
                    {
                        suiteTeardown(ruleTest.Postprocess);
                    }
                });
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
