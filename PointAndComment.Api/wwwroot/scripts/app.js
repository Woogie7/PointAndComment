import { Point } from './Point.js';

const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

const centerX = stage.width() / 2;
const centerY = stage.height() / 2;

$("#addPointBtn").on("click", () => {
    const newPoint = new Point({
        id: Date.now(),
        x: centerX + (Math.random() - 0.5) * 1000,
        y: centerY + (Math.random() - 0.5) * 600,
        color: Konva.Util.getRandomColor(),
        comments: [
        ],
        layer: layer,
    });
    console.log("asdas")
})
layer.draw();
