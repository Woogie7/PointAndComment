import {Comment} from "./Comment.js";
import {openAddCommentDialog} from "./dialogs.js";
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

        this.circle.on('mouseover', () => this.circle.opacity(0.3));
        this.circle.on('mouseout', () => this.circle.opacity(1));
        this.circle.on('dblclick', () => {
            this.circle.destroy();
            this.comments.forEach(comment => comment.destroy());
            this.comments.length = 0;
            this.layer.draw();
        });

        this.circle.on('contextmenu', (evt) => {
            evt.evt.preventDefault();
            openAddCommentDialog().then(result => {
                if(result.backgroundColor) {
                    this.circle.fill(result.backgroundColor);
                    this.layer.draw();
                }
                if(result.text) {
                    this.addComment(result.text, result.backgroundColor);
                }
            });
        });
        
        this.circle.on('dragmove', () => this.updateCommentsPosition());
        
        this.layer.add(this.circle);
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
}