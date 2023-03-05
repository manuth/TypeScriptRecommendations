import fs from "fs-extra";
import { TestContext } from "./TestContext.js";

const { writeJSON } = fs;

/**
 * Represents a suite for testing the behavior of an aspect of a tsconfig file.
 */
export abstract class TSConfigSuite
{
    /**
     * Gets the title of the suite.
     */
    protected abstract get Title(): string;

    /**
     * Gets the path to the configuration to test.
     */
    public abstract get ConfigPath(): string;

    /**
     * Initializes a new instance of the {@link TSConfigSuite `TSConfigSuite`} class.
     */
    public constructor()
    { }

    /**
     * Registers the suite.
     */
    public Register(): void
    {
        let context = new TestContext();

        suite(
            this.Title,
            () =>
            {
                suiteSetup(async () => this.SuiteSetup(context));
                suiteTeardown(async () => this.SuiteTeardown(context));
                this.RegisterInternal(context);
                setup(async () => this.Setup(context));
                teardown(async () => this.Teardown(context));
            });
    }

    /**
     * Registers all suites and tests inside this suite.
     *
     * @param context
     * The context of the underlying tests.
     */
    protected abstract RegisterInternal(context: TestContext): void;

    /**
     * Prepares the test suite.
     *
     * @param context
     * The context of the underlying tests.
     */
    protected async SuiteSetup(context: TestContext): Promise<void>
    {
        return this.Initialize(context);
    }

    /**
     * Disposes the resources of the test suite.
     *
     * @param context
     * The context of the underlying tests.
     */
    protected async SuiteTeardown(context: TestContext): Promise<void>
    {
        return this.Dispose(context);
    }

    /**
     * Prepares each test.
     *
     * @param context
     * The context of the underlying tests.
     */
    protected async Setup(context: TestContext): Promise<void>
    { }

    /**
     * Disposes the resources after each test.
     *
     * @param context
     * The context of the underlying tests.
     */
    protected async Teardown(context: TestContext): Promise<void>
    { }

    /**
     * Initializes the test suite.
     *
     * @param context
     * The context of the underlying tests.
     */
    protected async Initialize(context: TestContext): Promise<void>
    {
        await writeJSON(
            context.TempDir.MakePath("tsconfig.json"),
            {
                extends: this.ConfigPath
            });
    }

    /**
     * Disposes the test suite.
     *
     * @param context
     * The context of the underlying tests.
     */
    protected async Dispose(context: TestContext): Promise<void>
    {
        context.TempDir.Dispose();
    }
}
