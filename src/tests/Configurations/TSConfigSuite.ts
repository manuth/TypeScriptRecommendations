import { TempDirectory } from "@manuth/temp-files";
import fs from "fs-extra";

const { writeJSON } = fs;

/**
 * Represents a suite for testing the behavior of an aspect of a tsconfig file.
 */
export abstract class TSConfigSuite
{
    /**
     * Gets or sets the temporary directory for the tests.
     */
    private tempDir: TempDirectory = null;

    /**
     * Gets the title of the suite.
     */
    protected abstract get Title(): string;

    /**
     * Gets the path to the configuration to test.
     */
    public abstract get ConfigPath(): string;

    /**
     * Gets the temporary directory of the test.
     */
    protected get TempDir(): TempDirectory
    {
        if (this.tempDir === null)
        {
            this.tempDir = new TempDirectory();
        }

        return this.tempDir;
    }

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
        suite(
            this.Title,
            () =>
            {
                suiteSetup(async () => this.SuiteSetup());
                suiteTeardown(async () => this.SuiteTeardown());
                this.RegisterInternal();
                setup(async () => this.Setup());
                teardown(async () => this.Teardown());
            });
    }

    /**
     * Registers all suites and tests inside this suite.
     */
    protected abstract RegisterInternal(): void;

    /**
     * Prepares the test suite.
     */
    protected async SuiteSetup(): Promise<void>
    {
        return this.Initialize();
    }

    /**
     * Disposes the resources of the test suite.
     */
    protected async SuiteTeardown(): Promise<void>
    {
        return this.Dispose();
    }

    /**
     * Prepares each test.
     */
    protected async Setup(): Promise<void>
    { }

    /**
     * Disposes the resources after each test.
     */
    protected async Teardown(): Promise<void>
    { }

    /**
     * Initializes the test suite.
     */
    protected async Initialize(): Promise<void>
    {
        await writeJSON(
            this.TempDir.MakePath("tsconfig.json"),
            {
                extends: this.ConfigPath
            });
    }

    /**
     * Disposes the test suite.
     */
    protected async Dispose(): Promise<void>
    {
        this.TempDir.Dispose();
    }
}
