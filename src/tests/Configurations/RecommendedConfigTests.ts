import { strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import npmWhich from "npm-which";
import { CompilerOptions } from "typescript";
import { ConfigurationSuite } from "./ConfigurationTests.js";
import { IRuleTest } from "./IRuleTest.js";
import { TSConfigSuite } from "./TSConfigSuite.js";

const { ensureFile, existsSync, remove, writeFile, writeJSON } = fs;

/**
 * Provides tests for the recommended configuration.
 */
export class RecommendedConfigTests extends ConfigurationSuite
{
    /**
     * Initializes a new instance of the {@link RecommendedConfigTests `RecommendedConfigTests`} class.
     */
    public constructor()
    {
        super(join(fileURLToPath(new URL(".", import.meta.url)), "..", "..", "..", "recommended"));
    }

    /**
     * @inheritdoc
     */
    protected override get RuleTests(): Array<IRuleTest | TSConfigSuite>
    {
        return [
            {
                RuleName: nameof<CompilerOptions>((options) => options.resolveJsonModule),
                Preprocess: async () =>
                {
                    await writeJSON(this.TempDir.MakePath("test.json"), {});
                },
                ValidCode: [
                    'import test = require("./test.json");'
                ],
                Postprocess: async () =>
                {
                    await remove(this.TempDir.MakePath("test.json"));
                }
            },
            {
                RuleName: nameof<CompilerOptions>((options) => options.forceConsistentCasingInFileNames),
                Preprocess: async () =>
                {
                    await writeFile(this.TempDir.MakePath("Test.ts"), "export = 1;");
                },
                ValidCode: [
                    'import test = require("./Test");'
                ],
                InvalidCode: [
                    'import test = require("./tEsT");'
                ]
            },
            {
                RuleName: nameof<CompilerOptions>((options) => options.alwaysStrict),
                InvalidCode: [
                    'let interface = "";'
                ]
            },
            {
                RuleName: nameof<CompilerOptions>((options) => options.noImplicitAny),
                ValidCode: [
                    "function test(data: any) { }"
                ],
                InvalidCode: [
                    "function test(data) { }"
                ]
            },
            {
                RuleName: nameof<CompilerOptions>((options) => options.noImplicitOverride),
                ValidCode: [
                    `
                        class A
                        {
                            public TestMethod() { }
                        }

                        class B extends A
                        {
                            public override TestMethod() { }
                        }`
                ],
                InvalidCode: [
                    `
                        class A
                        {
                            public TestMethod() { }
                        }

                        class B extends A
                        {
                            public TestMethod() { }
                        }`
                ]
            },
            {
                RuleName: nameof<CompilerOptions>((options) => options.noImplicitReturns),
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
                RuleName: nameof<CompilerOptions>((options) => options.noImplicitThis),
                InvalidCode: [
                    '() => { this.Test = ""; }'
                ]
            }
        ];
    }

    /**
     * @inheritdoc
     */
    protected override RegisterInternal(): void
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
                        await ensureFile(self.TempDir.MakePath("index.ts"));
                        spawnSync(npmWhich(new URL(".", import.meta.url).pathname).sync("tsc"), ["-p", self.TempDir.MakePath()]);
                    });

                test(
                    "Checking whether declaration-files are created…",
                    () =>
                    {
                        strictEqual(existsSync(this.TempDir.MakePath("index.d.ts")), true);
                    });

                test(
                    "Checking whether source-maps are created…",
                    () =>
                    {
                        strictEqual(existsSync(this.TempDir.MakePath("index.js.map")), true);
                    });
            });

        super.RegisterInternal();
    }
}
