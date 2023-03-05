import { TempDirectory } from "@manuth/temp-files";

/**
 * Represents the context of a test.
 */
export class TestContext
{
    /**
     * The temporary directory of the current tests.
     */
    private tempDir: TempDirectory | null = null;

    /**
     * Initializes a new instance of the {@link TestContext `TestContext`} class.
     */
    public constructor()
    { }

    /**
     * Gets the temporary directory of the current tests.
     */
    public get TempDir(): TempDirectory
    {
        if (this.tempDir === null)
        {
            this.tempDir = new TempDirectory();
        }

        return this.tempDir;
    }
}
