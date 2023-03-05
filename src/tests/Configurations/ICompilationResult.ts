/**
 * Represents the result of a compilation.
 */
export interface ICompilationResult
{
    /**
     * The path to the compiled file.
     */
    compiledFile: string;

    /**
     * The compiled source code.
     */
    compiledCode: string;

    /**
     * The exit code.
     */
    status: number;
}
