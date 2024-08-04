import Actor from './Actor';
import Input, { MouseButton } from './Input';
import { StaticMesh } from './StaticMesh';
import StaticMeshComponent from './StaticMeshComponent';

import * as THREE from 'three';

type TranslationAxis = 'X' | 'Y' | 'Z';
type GizmoElementData = {
  element: THREE.Mesh;
  index: number;
  defaultColor: THREE.Color;
  axis: TranslationAxis[];
};

export default class TransformGizmoActor extends Actor {
  protected _gizmoMeshComponent: StaticMeshComponent;
  protected _hoveredGizmoElement: THREE.Mesh | null = null;
  protected _hoveredGizmoElementIndex: number = -1;

  protected _gizmoElements: GizmoElementData[] = [];

  protected static _matColors = [0xffffff, 0x0000ff, 0x00ff00, 0xff0000];

  protected _curTranslationAxis: TranslationAxis[] = [];
  protected _isTranslating: boolean = false;

  constructor() {
    super();

    this._gizmoMeshComponent = this.AddComponent(StaticMeshComponent);
  }

  public BeginPlay(): void {
    Input.OnMouseButtonPressed.AddListener((e) => {
      const mouseButton = e.mouseButton as MouseButton;
      if (mouseButton === 'MOUSE_LEFT') {
        if (this._hoveredGizmoElement !== null) {
          const data = this._gizmoElements[this._hoveredGizmoElementIndex];
          this._curTranslationAxis = data.axis;
          this._isTranslating = true;
        }
      }
    });

    Input.OnMouseButtonReleased.AddListener((e) => {
      const mouseButton = e.mouseButton as MouseButton;
      if (mouseButton === 'MOUSE_LEFT') {
        this._curTranslationAxis = [];
        this._isTranslating = false;
      }
    });
  }

  public Tick(_deltaTime: number): void {
    // document.body.style.cursor =
    //   this._hoveredGizmoElement !== null || this._isTranslating ? 'grab' : 'default';

    if (this._isTranslating) {
      this.DoTranslation();
    } else {
      this.TrackHoveredElement();
    }
  }

  protected DoTranslation() {
    const renderMesh = this._gizmoMeshComponent.GetStaticMesh()?.GetRenderMesh();
    if (renderMesh == undefined) return;
  }

  protected TrackHoveredElement() {
    const [hoveredElement, index] = this.GetHoveredGizmoElement();

    if (hoveredElement !== this._hoveredGizmoElement) {
      if (this._hoveredGizmoElement !== null) {
        const gizMat = this._hoveredGizmoElement?.material as THREE.MeshBasicMaterial;
        gizMat.color = new THREE.Color(
          TransformGizmoActor._matColors[this._hoveredGizmoElementIndex]
        );
      }

      if (hoveredElement !== null) {
        const gizMat = hoveredElement?.material as THREE.MeshBasicMaterial;
        gizMat.color = new THREE.Color(TransformGizmoActor._matColors[index]).lerp(
          new THREE.Color(0xffffff),
          0.5
        );
      }

      this._hoveredGizmoElement = hoveredElement;
      this._hoveredGizmoElementIndex = index;
    }
  }

  protected GetHoveredGizmoElement(): [THREE.Mesh | null, number] {
    const world = this.GetWorld();
    if (world === undefined) return [null, -1];

    const testPos = window.Editor.GetMousePositionInViewport();
    const hit = world.LineTraceSingle(testPos);

    if (hit.actor === this) {
      const staticMesh = this._gizmoMeshComponent.GetStaticMesh();
      if (staticMesh !== undefined) {
        const elementIndex = hit.renderObject?.parent?.children.indexOf(hit.renderObject) ?? 0;

        return [hit.renderObject as THREE.Mesh, elementIndex];
      }
    }

    return [null, -1];
  }

  public async Load(): Promise<void> {
    super.Load();

    StaticMesh.FromGLTF('src/assets/models/gizmo.glb', (staticMesh) => {
      this._gizmoMeshComponent.SetStaticMesh(staticMesh);

      const renderMesh = staticMesh.GetRenderMesh();
      renderMesh.position.y += 3;

      this.RegisterGizmoElement(renderMesh, 0).axis = ['X', 'Y', 'Z'];
      this.RegisterGizmoElement(renderMesh, 1).axis = ['Z'];
      this.RegisterGizmoElement(renderMesh, 2).axis = ['Y'];
      this.RegisterGizmoElement(renderMesh, 3).axis = ['X'];

      for (let i = 0; i < TransformGizmoActor._matColors.length; i++) {
        (renderMesh.children[i] as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: TransformGizmoActor._matColors[i]
        });
      }
    });
  }

  protected RegisterGizmoElement(renderMesh: THREE.Mesh, index: number): GizmoElementData {
    const gizmoElementData: GizmoElementData = {
      element: renderMesh.children[index] as THREE.Mesh,
      index: index,
      defaultColor: new THREE.Color(TransformGizmoActor._matColors[index]),
      axis: ['X']
    };

    this._gizmoElements[index] = gizmoElementData;
    return gizmoElementData;
  }

  public AllowEditorSelection(): boolean {
    return false;
  }
}
