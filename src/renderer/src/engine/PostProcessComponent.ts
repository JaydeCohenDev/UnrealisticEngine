import ActorComponent from './ActorComponent';
import { UProperty } from './Decorators';

export default class PostProcessComponent extends ActorComponent {
  @UProperty({ category: 'Bloom' })
  protected EnableBloom: boolean = true;

  @UProperty({ category: 'Bloom' })
  protected BloomStrength: number = 1.0;

  @UProperty({ category: 'Bloom' })
  protected BloomRadius: number = 0.0;

  @UProperty({ category: 'Bloom' })
  protected BloomThreshold: number = 0;

  @UProperty({ category: 'Temporal Anti-Aliasing' })
  protected EnableTAA: boolean = true;

  @UProperty({ category: 'Temporal Anti-Aliasing' })
  protected TAASamples: number = 8;
}
