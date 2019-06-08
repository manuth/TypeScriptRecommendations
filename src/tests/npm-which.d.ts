declare module "npm-which"
{
    /**
     * Provides options for the `npmwhich`-module.
     */
    interface NpmWhichOptions
    {
        /**
         * The environment to use for resolving the binary.
         */
        env?: NodeJS.ProcessEnv;

        /**
         * The directory to find the binary for.
         */
        cwd?: string;
    }

    /**
     * Provides options for the `npmwhich`-module.
     */
    interface StaticWhichOptions
    {
        /**
         * The environment to use for resolving the binary.
         */
        env?: NodeJS.ProcessEnv;

        /**
         * The directory to find the binary for.
         */
        cwd: string;
    }

    /**
     * Represents a callback for handling the result of `NpmWhich`.
     */
    interface NpmWhichCallback
    {
        /**
         * Handles the result of `NpmWhich`.
         *
         * @param error
         * The error-message.
         *
         * @param result
         * The result.
         */
        (error: string, result: string): void;
    }

    /**
     * Represents the static instance of `npm-which`.
     */
    interface StaticWhich extends NpmWhich
    {
        /**
         * Initializes an `NpmWhich`-instance for the specified working-directory.
         *
         * @param cwd
         * The working-directory to browse.
         */
        (cwd?: string): NpmWhich;

        /**
         * Searches for the specified command.
         *
         * @param cmd
         * The command to look for.
         *
         * @param options
         * The options for searching the command.
         */
        sync(cmd: string, options?: StaticWhichOptions): string;
    }

    /**
     * Provides the functionality to search for a command.
     */
    interface NpmWhich
    {
        /**
         * Creates a searcher for the specified command.
         *
         * @param cmd
         * The command to look for.
         *
         * @param options
         * The default options.
         *
         * @return
         * A searcher for the specified command.
         */
        (cmd: string, options?: NpmWhichOptions): InnerWhich;

        /**
         * Searches for the specified command.
         *
         * @param cmd
         * The command to look for.
         *
         * @param options
         * The options for searching the command.
         *
         * @param callback
         * A callback for handling the result.
         */
        (cmd: string, options: NpmWhichOptions, callback: NpmWhichCallback): void;

        /**
         * Searches for the specified command.
         *
         * @param cmd
         * The command to look for.
         *
         * @param options
         * The options for searching the command.
         */
        sync(cmd: string, options?: NpmWhichOptions): string;
    }

    interface InnerWhich
    {
        /**
         * Creates a searcher for the specified command.
         */
        (): InnerWhich;

        /**
         * Creates a searcher for the specified command.
         *
         * @param options
         * The options for searching the command.
         */
        (options: NpmWhichOptions): InnerWhich;

        /**
         * Searches for the command.
         *
         * @param callback
         * A callback for handling the result.
         */
        (callback: NpmWhichCallback): void;

        /**
         * Searches for the command.
         *
         * @param options
         * The options for searching the command.
         *
         * @param callback
         * A callback for handling the result.
         */
        (options: NpmWhichOptions, callback: NpmWhichCallback): void;

        /**
         * Searches for the command.
         *
         * @param options
         * The options for searching the command.
         */
        sync(options?: NpmWhichOptions): string;
    }

    let npmWhich: StaticWhich;
    export = npmWhich;
}