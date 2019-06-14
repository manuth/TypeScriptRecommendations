import Assert = require("assert");
import { spawnSync } from "child_process";
import FileSystem = require("fs-extra");
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";

/**
 * Provides tests for a typescript-configuration
 */
export abstract class ConfigurationTests
{
    /**
     * Gets or sets the temporary directory.
     */
    protected readonly TempDir: TempDirectory;

    /**
     * Gets the path to the configuration to test.
     */
    protected ConfigurationPath: string;

    /**
     * Gets or sets valid code-snippets.
     */
    protected ValidCode: string[] = [];

    /**
     * Gets or sets invalid code-snippets.
     */
    protected InvalidCode: string[] = [];

    /**
     * Initializes a new instance of the `ConfigurationTests` class.
     *
     * @param configurationPath
     * The path to the configuration to test.
     */
    public constructor(tempDir: TempDirectory, configurationPath: string)
    {
        this.TempDir = tempDir;
        this.ConfigurationPath = configurationPath;
        FileSystem.writeJSONSync(
            this.TempDir.MakePath("tsconfig.json"),
            {
                extends: this.ConfigurationPath
            });
    }

    /**
     * Tests the valid code-snipptes.
     */
    public async TestValidCode()
    {
        await this.AssertCode(this.ValidCode, false);
    }

    /**
     * Tests the invalid code-snipptes.
     */
    public async TestInvalidCode()
    {
        await this.AssertCode(this.InvalidCode, true);
    }

    /**
     * Tests code-lines for `tsc`s exit-codes.
     *
     * @param codeLines
     * The code-lines to test.
     *
     * @param error
     * A value indicating whether an error is expected.
     */
    protected async AssertCode(codeLines: string[], error: boolean)
    {
        for (let codeLine of codeLines)
        {
            Assert.strictEqual(await this.TestCode(codeLine) !== 0, error);
        }
    }

    /**
     * Tests a code using `tsc`.
     *
     * @param code
     * The code to execute.
     *
     * @return
     * The exit-code of the test.
     */
    protected async TestCode(code: string): Promise<number>
    {
        await FileSystem.writeFile(this.TempDir.MakePath("index.ts"), code);
        return spawnSync(npmWhich(__dirname).sync("tsc"), ["-p", this.TempDir.MakePath()]).status;
    }
}