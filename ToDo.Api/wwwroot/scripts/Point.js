import {Comment} from "./Comment.js";

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

        this.circle.on("click", (evt) => {
            if (evt.evt.button === 2) {

                const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
                let selectedColor = colors[0];

                const $dlg = $(`<div id='commentDialog'><label>Выберите цвет круга:</label></div>`).appendTo("body");
                
                const dialog = $dlg.kendoDialog({
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
                                if (!txt) return false;

                                this.addComment(txt, Konva.Util.getRandomColor());
                                return true;
                            }
                        }
                    ],
                    close: function () {
                        this.destroy();
                        $dlg.remove();
                    }
                }).data("kendoDialog");

                

                const $colorButtons = $('<div style="display:flex; gap:10px; margin-bottom:10px;"></div>');
                colors.forEach(color => {
                    const $btn = $(`<div style="
          width:30px; height:30px; background-color:${color}; cursor:pointer; border: 2px solid transparent; border-radius: 4px;
        "></div>`);

                    $btn.on('click', () => {
                        this.circle.fill(color);
                        dialog.close();
                    });

                    $colorButtons.append($btn);
                });
                $colorButtons.children().first().css('border-color', 'black');

                $dlg.append($colorButtons);

                $dlg.prepend("<textarea id='commentText' rows='4' style='width:100%'></textarea>");

                dialog.open();
            }
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
        this.comments.forEach((comment, index) => {
            comment.updatePosition(index);
        });
        this.layer.batchDraw();
    }

    addComment(text, backgroundColor) {
        const comment = new Comment({ text, backgroundColor, parent: this });
        this.comments.push(comment);
        
        console.log(this.comments);
        comment.render(this.layer, this.comments.length - 1);

        this.radius = 30 + this.comments.length * 10;
        this.circle.radius(this.radius);
        this.updateCommentsPosition(); 
        this.layer.draw();
    }

    redrawComments() {
        this.commentLabels.forEach(label => label.destroy());
        this.commentLabels = [];
        this.drawComments();
    }

}