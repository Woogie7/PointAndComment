export class Comment{
    constructor({text, color, parent}) {
        this.text = text;
        this.color = color;
        this.parent  = parent ;
        
        this.label = null;
        this.textNode = null;
    }
    
    render(layer, index) {
        this.label = new Konva.Label({
            x: this.parent.circle.x(),
            y: this.parent.circle.y() + this.parent.circle.radius() + 25 + index * 25
        });

        this.label.add(new Konva.Tag({
            fill: this.color || 'lightyellow',
            pointerDirection: 'down',
            pointerWidth: 0,
            pointerHeight: 0,
            lineJoin: 'round',
            cornerRadius: 4
        }));

        console.log(this.text)
        this.textNode =new Konva.Text({
            text: this.text,
            fontSize: 14,
            padding: 4,
            fill: 'black'
        });

        this.label.add(this.textNode);

        this.label.on('click', () => this.edit());

        layer.add(this.label);
        layer.draw();
    }

    updatePosition(index){
        if (!this.label) return;

        const bubbleX = this.parent.circle.x();
        const bubbleY = this.parent.circle.y() + this.parent.circle.radius() + 25 + index * 25;

        this.label.position({ x: bubbleX, y: bubbleY });
    }

    edit() {
        const $dlg = $(`
    <div>
      <label for="editText">Редактировать комментарий:</label>
      <textarea id="editText" rows="4" style="width:100%">${this.text}</textarea>
    </div>
  `).appendTo('body');

        const dialog = $dlg.kendoDialog({
            width: 400,
            modal: true,
            title: "Редактирование комментария",
            actions: [
                { text: "Отмена" },
                {
                    text: "Сохранить",
                    primary: true,
                    action: () => {
                        const newText = $dlg.find('#editText').val().trim();
                        if (!newText) return false;

                        this.text = newText;                    
                        this.textNode.text(newText);          
                        this.parent.updateCommentsPosition();  

                        return true;
                    }
                }
            ],
            close: function () {
                this.destroy();
                $dlg.remove();
            }
        }).data('kendoDialog');

        dialog.open();
    }
}