import { ok, strictEqual } from "node:assert";
import { Project, SyntaxKind } from "ts-morph";
import { CompilerOptions } from "typescript";
import { IRuleTest } from "./IRuleTest.js";
import { RuleSuite } from "./RuleSuite.js";
import { TestContext } from "./TestContext.js";
import { TSConfigSuite } from "./TSConfigSuite.js";

/**
 * Provides the functionality to test the {@link }
 */
export class AlwaysStrictSuite extends RuleSuite
{
    /**
     * Initializes a new instance of the {@link AlwaysStrictSuite `AlwaysStrictSuite`} class.
     *
     * @param parentSuite
     * The parent of this suite.
     */
    public constructor(parentSuite: TSConfigSuite)
    {
        super(parentSuite, {} as IRuleTest);
    }

    /**
     * @inheritdoc
     */
    protected override get RuleTest(): IRuleTest
    {
        return {
            RuleName: nameof<CompilerOptions>(c => c.alwaysStrict)
        };
    }

    /**
     * @inheritdoc
     *
     * @param context
     * The context of the underlying tests.
     */
    protected override RegisterInternal(context: TestContext): void
    {
        let self = this;
        let useStrictText = "use strict";

        test(
            `Checking whether ${JSON.stringify(useStrictText)} is emitted to each file…`,
            async function()
            {
                this.slow(30 * 1000);
                this.timeout(60 * 1000);

                let result = await self.CompileCode(context, "");
                let project = new Project();
                let sourceFile = project.addSourceFileAtPath(result.compiledFile);
                let useStrictExpression = sourceFile.getFirstDescendantByKind(SyntaxKind.StringLiteral);

                ok(useStrictExpression);
                strictEqual(useStrictExpression.getPos(), 0);
                strictEqual(useStrictExpression.getLiteralValue(), useStrictText);
            });
    }
}
