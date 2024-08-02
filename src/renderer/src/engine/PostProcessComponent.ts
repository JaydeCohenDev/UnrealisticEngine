import ActorComponent from './ActorComponent';
import { UProperty } from './Decorators';

export default class PostProcessComponent extends ActorComponent {
  @UProperty({ category: 'Bloom' })
  protected EnableBloom: boolean = true;

  @UProperty({ category: 'Bloom', numberStepSize: 0.1, minVal: 0 })
  protected BloomStrength: number = 0.1;

  @UProperty({ category: 'Bloom', numberStepSize: 0.1, minVal: 0 })
  protected BloomRadius: number = 0.0;

  @UProperty({ category: 'Bloom', numberStepSize: 0.1, minVal: 0 })
  protected BloomThreshold: number = 0;

  @UProperty({ category: 'Temporal Anti-Aliasing' })
  protected EnableTAA: boolean = true;

  @UProperty({ category: 'Temporal Anti-Aliasing' })
  protected TAASamples: number = 8;

  public Tick(_deltaTime: number): void {
    if (window.RenderContext === undefined) return;

    const postStack = window.RenderContext.PostProcessStack;

    if (postStack.bloomPass !== undefined) {
      postStack.bloomPass.enabled = this.EnableBloom;
      postStack.bloomPass.strength = this.BloomStrength;
      postStack.bloomPass.radius = this.BloomRadius;
      postStack.bloomPass.threshold = this.BloomThreshold;
    }
  }
}
