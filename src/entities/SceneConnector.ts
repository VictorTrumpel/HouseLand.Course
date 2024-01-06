import { Vector2, Intersection, Object3D, Group, Mesh, Event } from 'three';

type GetIntersectWithGround = (pointer: Vector2) => Intersection<Object3D<Event>>;
type GetIntersectWithScene = (pointer: Vector2) => Intersection<Object3D<Event>>[];
type GetPointerPosition = (pointer: PointerEvent | MouseEvent) => Vector2;
type AddToScene = (element: Object3D<Event> | Group | Mesh) => void;

export class SceneConnector {
  getPointerPosition: GetPointerPosition | null = null;
  getIntersectWithGround: GetIntersectWithGround | null = null;
  getIntersectWithScene: GetIntersectWithScene | null = null;
  addToScene: AddToScene | null = null;
  removeFromScene: AddToScene | null = null;
}
