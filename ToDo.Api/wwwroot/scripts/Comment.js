import { openEditCommentDialog } from './dialogs.js';
export class Comment{
    constructor({text, backgroundColor, parent}) {
        this.text = text;
        this.backgroundColor = backgroundColor;
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
            fill: this.backgroundColor  || 'lightyellow',
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

        this.label.on('contextmenu', (evt) =>
        {
            evt.evt.preventDefault();

            openEditCommentDialog(this.text).then(result => {
                if (result) {
                    this.update(result);
                }
            });
        });
        
        this.label.on('dblclick', () => {
            this.label.destroy();
        })

        layer.add(this.label);
        layer.draw();
    }

    updatePosition(index){
        if (!this.label) return;

        const bubbleX = this.parent.circle.x();
        const bubbleY = this.parent.circle.y() + this.parent.circle.radius() + 25 + index * 25;

        this.label.position({ x: bubbleX, y: bubbleY });
    }
    update({ text = this.text, backgroundColor = this.backgroundColor }) {
        this.text = text;
        this.backgroundColor = backgroundColor;

        if (this.textNode) {
            this.textNode.text(this.text);
        }

        if (this.label) {
            const tag = this.label.findOne('Tag');
            if (tag) tag.fill(this.backgroundColor);
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