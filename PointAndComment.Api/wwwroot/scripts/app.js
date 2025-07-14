import { fetchPoints } from './api.js';
import { addPoint  } from './api.js';
import { AppStore } from './store.js';
import { Point } from "./Point.js";

window.appStore = new AppStore();

const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

appStore.setLayer(layer);
appStore.setStage(stage);


await appStore.loadPointsFromServer(fetchPoints);

$("#addPointBtn").on("click", async () => {
    const centerX = stage.width() / 2;
    const centerY = stage.height() / 2;
    
    const pointData = {
        x: centerX + (Math.random() - 0.5) * 1000,
        y: centerY + (Math.random() - 0.5) * 600,
        color: Konva.Util.getRandomColor(),
        radius: 30,
    };
    try {
        const createdPoint = await addPoint(pointData);

        const pt = new Point({
            id: createdPoint.id,
            x: createdPoint.x,
            y: createdPoint.y,
            radius: createdPoint.radius || 30,
            color: createdPoint.color,
            comments: createdPoint.comments || []
        });

        appStore.addPoint(pt);
    } catch (e) {
        console.error('Ошибка при добавлении точки:' + e);
        alert('Неудалось создать точку...');
    }
});