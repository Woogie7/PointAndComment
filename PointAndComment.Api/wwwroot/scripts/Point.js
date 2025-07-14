import { deletePoint, addCommentToPoint, updatePointPosition, updatePointColor, fetchPointById} from './api.js';
import {openAddCommentDialog} from "./dialogs.js";
import {Comment} from "./Comment.js";

export class Point {
    constructor({ id, x, y, radius, color, comments = [] }) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.comments = comments.map(c => new Comment({ ...c, pointId: this.id }));

        this.circle = null;
    }

    attachToLayer(layer){
        this.circle = new Konva.Circle({
            x: this.x,
            y: this.y,
            radius: this.radius,
            fill: this.color,
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        });
        
        this.setupEvents();
        
        layer.add(this.circle);
        
        this.comments.forEach((comment, index) => {
            comment.render(layer, this.x, this.y, this.radius, index);
        });

        this.circle.on('dragmove', () => {
            this.updateCommentsPosition(layer);
        });
    }

    
    
    setupEvents() {
        this.circle.on('mouseover', () => this.circle.opacity(0.3));
        this.circle.on('mouseout', () => this.circle.opacity(1));
        this.circle.on('dblclick', async () => {
            if (confirm('Удалить эту точку?')) {
                try {
                    await deletePoint(this.id);
                    this.destroy();
                } catch (e) {
                    alert('Ошибка удаления точки: ' + e.message);
                }
            }
        });

        this.circle.on('contextmenu', async (evt) => {
            evt.evt.preventDefault();

            const result = await openAddCommentDialog();

            if (result.backgroundColor) {
                try {
                    await updatePointColor(this.id, result.backgroundColor);
                    this.circle.fill(result.backgroundColor);
                } catch (e) {
                    console.error('Ошибка при обновлении цвета: ' + e);
                    alert('Не удалось изменить цвет...');
                }
            }

            if (result.text) {
                try {
                    await addCommentToPoint(this.id, {
                        text: result.text,
                        backgroundColor: result.backgroundColor || 'lightyellow'
                    });
                    
                    const updatedPoint = await fetchPointById(this.id);
                    
                    window.appStore.updatePoint(this.id, updatedPoint);
                } catch (e) {
                    console.error('Ошибка при добавлении комментария: ' + e);
                    alert('Не удалось добавить комментарий...');
                }
            }
            window.appStore.layer.batchDraw()
        });

        this.circle.on('dragend', async () => {
            const pos = { x: this.circle.x(), y: this.circle.y() };
            try {
                
                await updatePointPosition(this.id, pos);
                this.updateCommentsPosition(window.appStore.layer);
            } catch (e) {
                console.error('Ошибка сохранения позиции:' + e);
                alert('Не удалось поменять позицию...' + e.message);
            }
        });
    }
    updateCommentsPosition(layer) {
        const x = this.circle.x();
        const y = this.circle.y();
        const radius = this.circle.radius();

        this.comments.forEach((comment, index) => {
            const bubbleY = y + radius + 25 + index * 25;
            comment.updatePosition(x, bubbleY);
        });

        layer.batchDraw();
    }
    recalculateRadiusAndCommentsPosition() {
        this.radius = 30 + this.comments.length * 10;
        if (this.circle) {
            this.circle.radius(this.radius);
        }

        const x = this.circle ? this.circle.x() : this.x;
        const y = this.circle ? this.circle.y() : this.y;

        this.comments.forEach((comment, index) => {
            const bubbleY = y + this.radius + 25 + index * 25;
            comment.updatePosition(x, bubbleY);
        });

        if (this.circle && this.circle.getLayer()) {
            this.circle.getLayer().batchDraw();
        }
    }
    update(data){
        if (data.x !== undefined) this.x = data.x;
        if (data.y !== undefined) this.y = data.y;
        if (data.radius !== undefined) this.radius = data.radius;
        if (data.color !== undefined) this.color = data.color;
        
        if (this.circle) {
            this.circle.position({ x: this.x, y: this.y });
            this.circle.radius(this.radius);
            this.circle.fill(this.color);
        }
        
        if (Array.isArray(data.comments)) {
            this.comments.forEach(c => c.destroy());
            this.comments = [];

            data.comments.forEach((cData, idx) => {
                const c = new Comment({ ...cData, pointId: this.id });
                c.render(window.appStore.layer, this.x, this.y, this.radius, idx);
                this.comments.push(c);
            });
        }
        this.recalculateRadiusAndCommentsPosition();
    }
    destroy() {
        this.circle.destroy();
        this.comments.forEach(c => c.destroy());
        this.comments = [];
    }
}