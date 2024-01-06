import { Color } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

export class PathLine extends Line2 {
  constructor(color?: number) {
    const geometry = new LineGeometry();
    geometry.setPositions([1, 1, 1, 5, 5, 5]);
    geometry.setColors([1, 1, 1, 1, 1, 1]);

    const matLine = new LineMaterial({
      color: color || 0x635c5a,
      linewidth: 0.005,
      vertexColors: true,
    });

    super(geometry, matLine);
  }

  setFromTo(fromPoint: [number, number, number], toPoint: [number, number, number]) {
    this.geometry.setPositions([...fromPoint, ...toPoint]);
  }

  setColor(color: number) {
    this.material.color = new Color(color);
  }
}
