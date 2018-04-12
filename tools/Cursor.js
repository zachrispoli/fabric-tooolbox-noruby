(function () {

    window.CursorTool = new PaperToolbox.Tool({
        name: 'Cursor',
        icon: 'cursor.svg',
        onMouseDown : function (e) {
            
        },
        onDoubleClick : function (e) {

        },
        onMouseMove : function (e) {
            
        },
        onMouseDrag : function (e) {
            
        },
        onMouseUp : function (e) {
            
        },
        onSelected : function (e) {
            e.fabric.selection = true;
            e.fabric.forEachObject(function(o) {
                o.selectable = true;
            });
        },
        onDeselected : function (e) {

        },
    });

})();