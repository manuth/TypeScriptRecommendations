import FileSystem = require("fs-extra");
import Path = require("path");
import { TempDirectory } from "temp-filesystem";
import { ConfigurationTests } from "./ConfigurationTests.test";

/**
 * Provides tests for the recommended typescript-configuration.
 */
class RecommendedConfigurationTests extends ConfigurationTests
{
    /**
     * Initializes a new instance of the `RecommendedConfigurationTests` class.
     *
     * @param tempDir
     * The directory for hosting the test-environment.
     */
    public constructor(tempDir: TempDirectory)
    {
        super(tempDir, Path.join(__dirname, "..", "..", "..", "recommended"));
        FileSystem.writeJSONSync(tempDir.MakePath("data.json"), {});
        FileSystem.writeFileSync(tempDir.MakePath("test.ts"), "export = 1");
        this.ValidCode = [
            "import data = require('./data.json')",
            "import num = require('./test')",
            "function log(data: any) { console.log(data); }"
        ];
        this.InvalidCode = [
            "import * as num from './tEst'",
            "function log(data) { console.log(data); }",
            "() => { if (Math.random() > 0.5) return 12 }",
            "() => { this.blargh = 'hacks'; }"
        ];
    }
}

suite(
    "Testing recommended configuration…",
    () =>
    {
        /**
         * The temporary directory.
         */
        let tempDir: TempDirectory;

        /**
         * An object which provides tests.
         */
        let configurationTests: ConfigurationTests;

        suiteSetup(
            () =>
            {
                tempDir = new TempDirectory();
                configurationTests = new RecommendedConfigurationTests(tempDir);
            });

        test(
            "Testing whether valid code is able to compile…",
            async function ()
            {
                this.timeout(30 * 1000);
                this.slow(15 * 1000);
                await configurationTests.TestValidCode();
            });

        test(
            "Testing whether invalid code causes errors…",
            async function ()
            {
                this.timeout(30 * 1000);
                this.slow(15 * 1000);
                await configurationTests.TestInvalidCode();
            });

        suiteTeardown(
            () =>
            {
                tempDir.Dispose();
            });
    });