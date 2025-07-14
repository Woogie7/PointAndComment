    import { openEditCommentDialog } from './dialogs.js';
    import { updateComment, deleteComment, fetchPointById } from './api.js';
    export class Comment{
        constructor({id, text, backgroundColor, pointId}) {
            this.id = id;            
            this.pointId = pointId;
            this.text = text;
            this.backgroundColor = backgroundColor;
            
            this.label = null;
            this.textNode = null;
        }

        render(layer, x, y, radius, index) {
            if (!layer) {
                console.error("Layer не определён");
                return;
            }
            const bubbleY = y + radius + 25 + index * 25;

            this.label = new Konva.Label({
                x: x,
                y: bubbleY
            });

            this.label.add(new Konva.Tag({
                fill: this.backgroundColor || 'lightyellow',
                pointerDirection: 'down',
                pointerWidth: 0,
                pointerHeight: 0,
                lineJoin: 'round',
                cornerRadius: 4
            }));

            this.textNode = new Konva.Text({
                text: this.text,
                fontSize: 14,
                padding: 4,
                fill: 'black'
            });

            this.label.add(this.textNode);

            this.label.on('contextmenu',  (evt) => {
                evt.evt.preventDefault();
                openEditCommentDialog(this.text).then(async result => {
                    if (result) {

                        const newColor = result.backgroundColor ?? this.backgroundColor;

                        await updateComment(this.id, {
                            text: result.text,
                            backgroundColor: newColor
                        });

                        this.update({
                            text: result.text,
                            backgroundColor: newColor
                        });

                        const updatedPoint = await fetchPointById(this.pointId);
                        window.appStore.updatePoint(this.pointId, updatedPoint);
                    }
                });
            });

            this.label.on('dblclick', async () => {
                if (confirm('Удалить эту комментарий?')) {
                    try {
                        await deleteComment(this.id);
                        this.label.destroy();

                        const point = window.appStore.getPoint(this.pointId);
                        if (point) {
                            point.comments = point.comments.filter(c => c.id !== this.id);
                            point.recalculateRadiusAndCommentsPosition();
                        }
                    }
                    catch (e) {
                        console.error("Ошибка удаления комментария" + e);
                        alert("Неудалось удалить комментарий...")
                    }
                }
            });

            layer.add(this.label);
        }

        updatePosition(x, y) {
            if (!this.label) return;
            this.label.position({ x, y });
        }
        update({ text, backgroundColor }) {
            if (text !== undefined) {
                this.text = text;
                if (this.textNode) {
                    this.textNode.text(this.text);
                }
            }

            if (backgroundColor !== undefined) {
                this.backgroundColor = backgroundColor;
                if (this.label) {
                    const tag = this.label.findOne('Tag');
                    if (tag) tag.fill(this.backgroundColor);
                }
            }
        }
    
        destroy() {
            if (this.label) {
                this.label.destroy();
                this.label = null;
                this.textNode = null;
            }
        }
    }