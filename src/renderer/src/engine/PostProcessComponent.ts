import ActorComponent from './ActorComponent';
import { UProperty } from './Decorators';
import * as THREE from 'three';

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

  @UProperty({ category: 'Temporal Anti-Aliasing', minVal: 0, maxVal: 8 })
  protected TAASamples: number = 4;

  @UProperty({ category: 'Outlines' })
  protected EnableOutlines: boolean = true;

  @UProperty({ category: 'Outlines' })
  protected OutlineColor: THREE.Color = new THREE.Color(0xffff00);

  public Tick(_deltaTime: number): void {
    if (window.RenderContext === undefined) return;

    const postStack = window.RenderContext.PostProcessStack;

    if (postStack.bloomPass !== undefined) {
      postStack.bloomPass.enabled = this.EnableBloom;
      postStack.bloomPass.strength = this.BloomStrength;
      postStack.bloomPass.radius = this.BloomRadius;
      postStack.bloomPass.threshold = this.BloomThreshold;
    }

    if (postStack.taaPass !== undefined) {
      postStack.taaPass.enabled = this.EnableTAA;
      postStack.taaPass.sampleLevel = this.TAASamples;
    }

    if (postStack.outlinePass !== undefined) {
      postStack.outlinePass.enabled = this.EnableOutlines;
      postStack.outlinePass.visibleEdgeColor = this.OutlineColor;
    }
  }
}
