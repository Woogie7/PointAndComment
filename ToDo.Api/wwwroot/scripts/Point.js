export class Point {
    constructor({ id, x, y, radius, color = 'red', comments = [] ,layer}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = comments.length > 0 ? 30 + comments.length * 10 : 30;
        this.color = color;
        this.comments = comments;

        this.layer = layer;
        
        this.circle = new Konva.Circle({
            x: this.x,
            y: this.y,
            radius: this.radius,
            fill: color,
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        });

        this.commentLabels = [];
        this.drawComments();

        this.circle.on('mouseover', () => this.circle.opacity(0.3));
        this.circle.on('mouseout', () => this.circle.opacity(1));
        this.circle.on('dblclick', () => {
            this.circle.destroy();
            this.commentLabels.forEach(label => label.destroy());
            this.layer.draw();
        });

        this.circle.on("click", () => {
            const $dlg = $("<div id='commentDialog'><textarea id='commentText' rows='4' style='width:100%'></textarea></div>")
                .appendTo("body");
            $dlg.kendoDialog({
                width: 400,
                modal: true,
                title: "Добавить комментарий",
                actions: [
                    { text: "Отмена" },
                    {
                        text: "Добавить",
                        primary: true,
                        action: () => {
                            const txt = $dlg.find("#commentText").val().trim();

                            console.log(txt);
                            console.log('я туту');
                            if (!txt) return false;
                            this.addComment({ text: txt });
                            return true;
                        }
                    }
                ],
                close: function () {
                    this.destroy();
                    $dlg.remove();
                }
            }).data("kendoDialog").open();
        });
        
        this.circle.on('dragmove', () => this.updateCommentsPosition());

       
        
        this.layer.add(this.circle);
        this.layer.draw();
    }

    drawComments() {
        this.comments.forEach((comment, index) => {
            const label = new Konva.Label({
                x: this.circle.x(),
                y: this.circle.y() + this.circle.radius() + 25 + index * 25
            });

            label.add(new Konva.Tag({
                fill: comment.backgroundColor || 'lightyellow',
                pointerDirection: 'down',
                pointerWidth: 0,
                pointerHeight: 0,
                lineJoin: 'round',
                cornerRadius: 4
            }));

            label.add(new Konva.Text({
                text: comment.text,
                fontSize: 14,
                padding: 4,
                fill: 'black'
            }));

            this.commentLabels.push(label);
            this.layer.add(label);
        });
        this.layer.draw();
    }

    updateCommentsPosition() {
        this.commentLabels.forEach((label, index) => {
            label.position({
                x: this.circle.x(),
                y: this.circle.y() + this.circle.radius() + 25 + index * 25,
            });
        });
        this.layer.batchDraw();
    }

    addComment(comment) {
        this.comments.push(comment);
        console.log(this.comments);
        this.redrawComments();
        this.layer.draw();
    }

    redrawComments() {
        this.commentLabels.forEach(label => label.destroy());
        this.commentLabels = [];
        this.drawComments();
    }

}