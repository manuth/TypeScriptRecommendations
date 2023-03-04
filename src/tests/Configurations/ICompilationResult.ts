/**
 * Represents the result of a compilation.
 */
export interface ICompilationResult
{
    /**
     * The compiled source code.
     */
    compiledCode: string;

    /**
     * The exit code.
     */
    status: number;
}
