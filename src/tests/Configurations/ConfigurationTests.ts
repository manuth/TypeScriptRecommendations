import Assert = require("assert");
import { spawnSync } from "child_process";
import { TempDirectory } from "@manuth/temp-files";
import FileSystem = require("fs-extra");
import npmWhich = require("npm-which");
import { IRuleTest } from "./IRuleTest";

/**
 * Provides tests for a typescript-configuration.
 */
export class ConfigurationTests
{
    /**
     * Gets or sets tests for tsconfig-settings.
     */
    public RuleTests: IRuleTest[] = [];

    /**
     * Gets or sets the temporary directory for the tests.
     */
    protected TempDir: TempDirectory;

    /**
     * Gets the path to the configuration to test.
     */
    protected readonly ConfigPath: string;

    /**
     * Initializes a new instance of the `ConfigurationTests` class.
     *
     * @param configPath
     * The path to the configuration to test.
     */
    public constructor(configPath: string)
    {
        this.ConfigPath = configPath;
    }

    /**
     * Registers the tests.
     */
    public Register(): void
    {
        suite(
            "Checking the integrity of the config…",
            () =>
            {
                suiteSetup(async () => this.Initialize());
                suiteTeardown(() => this.Dispose());
                this.RegisterInternal();
            });
    }

    /**
     * Registers the tests.
     */
    protected RegisterInternal(): void
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
     * Initializes the tests.
     */
    protected async Initialize(): Promise<void>
    {
        this.TempDir = new TempDirectory();

        await FileSystem.writeJSON(
            this.TempDir.MakePath("tsconfig.json"),
            {
                extends: this.ConfigPath
            });
    }

    /**
     * Disposes the tests.
     */
    protected Dispose(): void
    {
        this.TempDir.Dispose();
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
            Assert.strictEqual((await this.ProcessCode(codeSnippet)) !== 0, error);
        }
    }

    /**
     * Tests the `code` using `tsc`.
     *
     * @param code
     * The code to test.
     *
     * @returns
     * The exit-code of the test.
     */
    protected async ProcessCode(code: string): Promise<number>
    {
        await FileSystem.writeFile(this.TempDir.MakePath("index.ts"), code);
        return spawnSync(npmWhich(__dirname).sync("tsc"), ["-p", this.TempDir.MakePath()]).status;
    }
}
