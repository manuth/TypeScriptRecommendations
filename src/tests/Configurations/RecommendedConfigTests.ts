import Assert = require("assert");
import { spawnSync } from "child_process";
import Path = require("path");
import FileSystem = require("fs-extra");
import npmWhich = require("npm-which");
import { ConfigurationTests } from "./ConfigurationTests";

/**
 * Provides tests for the recommended configuration.
 */
export class RecommendedConfigTests extends ConfigurationTests
{
    /**
     * Initializes a new instance of the 'RecommendedConfigTests' class.
     */
    public constructor()
    {
        super(Path.join(__dirname, "..", "..", "..", "recommended"));
        this.RuleTests = [
            {
                RuleName: "resolveJsonModule",
                Preprocess: async () =>
                {
                    await FileSystem.writeJSON(this.TempDir.MakePath("test.json"), {});
                },
                ValidCode: [
                    'import test = require("./test.json");'
                ],
                Postprocess: async () =>
                {
                    await FileSystem.remove(this.TempDir.MakePath("test.json"));
                }
            },
            {
                RuleName: "forceConsistentCasingInFileNames",
                Preprocess: async () =>
                {
                    await FileSystem.writeFile(this.TempDir.MakePath("Test.ts"), "export = 1;");
                },
                ValidCode: [
                    'import test = require("./Test");'
                ],
                InvalidCode: [
                    'import test = require("./tEsT");'
                ]
            },
            {
                RuleName: "alwaysStrict",
                InvalidCode: [
                    'let interface = "";'
                ]
            },
            {
                RuleName: "noImplicitAny",
                ValidCode: [
                    "function test(data: any) { }"
                ],
                InvalidCode: [
                    "function test(data) { }"
                ]
            },
            {
                RuleName: "noImplicitReturns",
                ValidCode: [
                    `
                    () =>
                    {
                        if (Math.random() > 0.5)
                        {
                            return 1;
                        }
                        else
                        {
                            return 0;
                        }
                    }`
                ],
                InvalidCode: [
                    "() => { if (Math.random() > 0.5) return 1; }"
                ]
            },
            {
                RuleName: "noImplicitThis",
                InvalidCode: [
                    '() => { this.Test = ""; }'
                ]
            }
        ];
    }

    /**
     * @inheritdoc
     */
    protected RegisterInternal(): void
    {
        suite(
            "Checking the file-creation…",
            () =>
            {
                let self = this;

                suiteSetup(
                    async function()
                    {
                        this.timeout(8 * 1000);
                        await FileSystem.ensureFile(self.TempDir.MakePath("index.ts"));
                        spawnSync(npmWhich(__dirname).sync("tsc"), ["-p", self.TempDir.MakePath()]);
                    });

                test(
                    "Checking whether declaration-files are created…",
                    () =>
                    {
                        Assert.strictEqual(FileSystem.existsSync(this.TempDir.MakePath("index.d.ts")), true);
                    });

                test(
                    "Checking whether source-maps are created…",
                    () =>
                    {
                        Assert.strictEqual(FileSystem.existsSync(this.TempDir.MakePath("index.js.map")), true);
                    });
            });

        super.RegisterInternal();
    }
}
