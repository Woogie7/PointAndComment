import { Point } from "./Point.js";

export class AppStore{
    constructor() {
        this.points = new Map()
        this.layer = null;
        this.stage = null;
    }
    
    setStage(stage) {
        this.stage = stage;
    }
    
    setLayer(layer) { 
        this.layer = layer;
    }

    addPoint(point) {
        this.points.set(point.id, point);
        point.attachToLayer(this.layer);
        this.layer.draw();
    }

    removePoint(id) {
        const point = this.points.get(id);
        if (point) {
            point.destroy();
        }
        this.points.delete(id);
        this.layer.draw();
    }

    updatePoint(id, data) {
        const point = this.points.get(id);
        if (point) {
            point.update(data);
            this.layer.draw();
        }
    }
    getPoint(id) {
        return this.points.get(id);
    }

    getAllPoints() {
        return Array.from(this.points.values());
    }
    
    async loadPointsFromServer(fetchFn) {
        try{
            const pointsData = await fetchFn();
            
            this.getAllPoints().forEach(point => point.destroy());
            this.points.clear();
            
            for (const data of pointsData) {
                const point = new Point({
                    id: data.id,
                    x: data.x,
                    y: data.y,
                    radius: data.radius || 30,
                    color: data.color,
                    comments: data.comments || [],
                });
                
                console.log(point.radius);
                this.addPoint(point);
            }
            
            this.layer.draw();
        }
        catch(error) {
            console.error('Ошибка загрузки точек', error);
            alert('Не удалость загрузить точки с сервера')
        }
    }
    
    clear(){
        this.getAllPoints().forEach(p => p.destroy());
        this.points.clear();
        this.layer.draw();
    }
}
