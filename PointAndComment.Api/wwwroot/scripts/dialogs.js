export function openEditCommentDialog(currentText) {
    return new Promise((resolve, reject) => {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
        let selectedColor = colors[0];
        
        const $dlg = $(`
            <div>
              <label for="editText">Редактировать комментарий:</label>
              <textarea id="editText" rows="4" style="width:100%">${currentText}</textarea>
              <label>Выберите цвет круга:</label>
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
                        resolve({ text: newText });
                        return true;
                    }
                }
            ],
            close: function () {
                $dlg.remove();
            }
        }).data('kendoDialog');

        const $colorButtons = $('<div style="display:flex; gap:10px; margin-bottom:10px;"></div>');
        colors.forEach(color => {
            const $btn = $(`<div style="
          width:30px; height:30px; background-color:${color}; cursor:pointer; border: 2px solid transparent; border-radius: 4px;
        "></div>`);
            
            $btn.on('click', () => {
                resolve({ backgroundColor: color });
                dialog.close();
            });

            $colorButtons.append($btn);
        });

        $dlg.append($colorButtons);
        dialog.open();
    });
}

export function openAddCommentDialog() {
    return new Promise((resolve, reject) => {
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
                        resolve({text: txt})
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
                resolve({ backgroundColor: color });
                dialog.close();
            });

            $colorButtons.append($btn);
        });
        $colorButtons.children().first().css('border-color', 'black');

        $dlg.append($colorButtons);

        $dlg.prepend("<textarea id='commentText' rows='4' style='width:100%'></textarea>");

        dialog.open();
    });
}
