import { ProviderInterface } from '../providers/base.provider.js';
import { LiteratureRegistry, ScientificReference } from './literature.registry.js';

export class PluginRegistry {
  private static activeProvider: ProviderInterface | null = null;

  public static registerProvider(provider: ProviderInterface): void {
    this.activeProvider = provider;
  }

  public static getActiveProvider(): ProviderInterface {
    if (!this.activeProvider) {
      throw new Error('No Provider registered in PluginRegistry');
    }
    return this.activeProvider;
  }

  public static getRegisteredLiterature(): ScientificReference[] {
    return LiteratureRegistry.getAllReferences();
  }
}
