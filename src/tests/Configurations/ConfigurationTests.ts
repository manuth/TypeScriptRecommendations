import { IRuleTest } from "./IRuleTest.js";
import { RuleSuite } from "./RuleSuite.js";
import { TSConfigSuite } from "./TSConfigSuite.js";

/**
 * Provides tests for a typescript-configuration.
 */
export abstract class ConfigurationSuite extends TSConfigSuite
{
    /**
     * The path to the configuration to test.
     */
    private configPath: string;

    /**
     * Initializes a new instance of the {@link ConfigurationSuite `ConfigurationTests`} class.
     *
     * @param configPath
     * The path to the configuration to test.
     */
    public constructor(configPath: string)
    {
        super();
        this.configPath = configPath;
    }

    /**
     * Gets the tests of the tsconfig-settings.
     */
    protected abstract get RuleTests(): Array<IRuleTest | TSConfigSuite>;

    /**
     * @inheritdoc
     */
    protected get Title(): string
    {
        return "Checking the integrity of the configuration…";
    }

    /**
     * @inheritdoc
     */
    public override get ConfigPath(): string
    {
        return this.configPath;
    }

    /**
     * Registers the tests.
     */
    protected override RegisterInternal(): void
    {
        for (let ruleTest of this.RuleTests)
        {
            if (ruleTest instanceof TSConfigSuite)
            {
                ruleTest.Register();
            }
            else
            {
                new RuleSuite(this, ruleTest).Register();
            }
        }
    }
}
