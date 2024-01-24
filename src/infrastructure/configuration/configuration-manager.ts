import * as dotenv from 'dotenv';
import 'dotenv/config'

export class ConfigurationManager {
  private static instance: ConfigurationManager;

  protected constructor() {
    dotenv.config({ path: process.env.PWD + '/.env' });
  }

  static {
    ConfigurationManager.instance = new ConfigurationManager();
  }

  static configure() {
    return ConfigurationManager.instance;
  }

  public get(name: string, defaultValue?: string): string {
    return String(process.env[name] || defaultValue);
  }

  public getInt(name: string, defaultValue?: number): number {
    return +this.get(name, String(defaultValue));
  }
}
