var CONSTS = {
    DEFAULT_OPTIONS: {
        strokeWidth: 3,
        strokeColor: '#000000',
        strokeCap: 'round',
        strokeSmoothing: 0.5,
        fillColor: 'red',
        shapeMode: 'rect',
    },
    TOOLBOX_CLASS: 'papertoolbox_toolbox',
    TOOL_ICON_CLASS: 'papertoolbox_tool-icon',
    TOOL_ICON_ACTIVE_CLASS: 'papertoolbox_tool-icon-active',
}

var PaperToolbox = function (fabric) {

    var self = {};

    var tools = {};
    var options = getSavedOptions() || getDefaultOptions();
    var view;

    var activeTool = null;
    var noToolsAdded = true;

    /*
     * Example usage:
     *
     */
    function addTool (tool) {
        if(tools[tool.name]) console.error('Warning: duplicate tool named ' + tool.name + '!')

        function observeEvent (eventName, eventFn) {
            fabric.on(eventName, function (e) {
                if(tool === activeTool || tool.global) {
                    e.fabric = fabric;
                    e.options = options;
                    if(eventFn) eventFn(e);
                }
            });
        }

        observeEvent('mouse:down', tool.onMouseDown);
        observeEvent('mouse:up', tool.onMouseUp);
        observeEvent('mouse:move', tool.onMouseMove);
        observeEvent('mouse:dblclick', tool.onDoubleClick);
        observeEvent('mouse:wheel', tool.onScroll)

        tools[tool.name] = tool;
        if(noToolsAdded) {
            activateTool(tool.name);
            noToolsAdded = false;
        }

        if(view) view.reflectChanges(self);
    }

    /*
     * Example usage:
     *
     */
    function activateTool (name) {
        var tool = getTool(name);
        if(!tool) throw Error('Tool ' + name + ' does not exist!');

        fabric.selection = false;
        fabric.forEachObject(function(o) {
            o.selectable = false;
            o.hoverCursor = 'default';
        });
        fabric.isDrawingMode = false;
        fabric.defaultCursor = tool.cursor || 'default';

        var e = {fabric: fabric, options: options}
        if(activeTool) activeTool.onDeselected(e);
        activeTool = tool;
        activeTool.onSelected(e);

        if(view) view.reflectChanges(self);
    }

    /*
     * Example usage:
     *
     */
    function getTool (name) {
        return tools[name];
    }

    /*
     * Example usage:
     *
     */
    function getAllTools () {
        var allTools = [];

        for (name in tools) {
            allTools.push(tools[name]);
        }

        return allTools;
    }

    /*
     * Example usage:
     *
     */
    function getActiveTool (name) {
        return activeTool;
    }

    /*
     * Example usage:
     *
     */
    function getDefaultOptions () {
        return JSON.parse(JSON.stringify(CONSTS.DEFAULT_OPTIONS));
    }

    /*
     * Example usage:
     *
     */
    function getSavedOptions () {
        return null;
    }

    /*
     * Example usage:
     *
     */
    function resetOptionsToDefault () {
        options = getDefaultOptions();
    }

    /*
     * Example usage:
     *
     */
    function getOption (name) {
        return options[name];
    }

    /*
     * Example usage:
     *
     */
    function setOption (name, val) {
        options[name] = val;

        activateTool(activeTool.name);
        if(view) view.reflectChanges(self);
    }

    /*
     * Example usage:
     *
     */
    function createView (container) {
        view = new ToolboxView(container);
        view.reflectChanges(self);
    }

    var ToolboxView = function (container) {

        var viewDiv = document.createElement('div');
        viewDiv.className = CONSTS.TOOLBOX_CLASS;
        container.appendChild(viewDiv);

        var toolIcons = {};

        /*
         * Example usage:
         *
         */
        function reflectChanges (toolbox) {
            rebuildToolIcons(toolbox);

            for (name in toolIcons) {
                toolIcons[name].reflectChanges(toolbox);
            }
        }

        /*
         * Example usage:
         *
         */
        function rebuildToolIcons (toolbox) {
            toolbox.getAllTools().forEach(function (tool) {
                if(!tool.global && !toolIcons[tool.name]) {
                    toolIcons[tool.name] = new ToolIconView(viewDiv, tool);
                }
            });
        }

        this.reflectChanges = reflectChanges;

    }

    /*
     * Example usage:
     *
     */
    var ToolIconView = function (container, tool) {

        var viewDiv = document.createElement('div');
        viewDiv.className = CONSTS.TOOL_ICON_CLASS;
        viewDiv.innerHTML = tool.name;
        viewDiv.onclick = function (e) {
            self.activateTool(tool.name);
        }

        container.appendChild(viewDiv);

        /*
         * Example usage:
         *
         */
        function reflectChanges (toolbox) {
            viewDiv.className = CONSTS.TOOL_ICON_CLASS;
            if (toolbox.getActiveTool() === tool) {
                viewDiv.className += ' ' + CONSTS.TOOL_ICON_ACTIVE_CLASS;
            }
        }

        this.reflectChanges = reflectChanges;
        return this;

    }

    self.addTool = addTool;
    self.activateTool = activateTool;
    self.getTool = getTool;
    self.getAllTools = getAllTools;
    self.getActiveTool = getActiveTool;
    self.getOption = getOption;
    self.setOption = setOption;
    self.resetOptionsToDefault = resetOptionsToDefault;
    self.createView = createView;
    self.fabric = fabric;
    return self;

};

PaperToolbox.Tool = function (args) {

    this.name = args.name;
    this.cursor = args.cursor;
    this.global = args.global;
    this.onMouseDown = args.onMouseDown;
    this.onMouseUp = args.onMouseUp;
    this.onMouseMove = args.onMouseMove;
    this.onScroll = args.onScroll;
    this.onDoubleClick = args.onDoubleClick;
    this.onSelected = args.onSelected;
    this.onDeselected = args.onDeselected;

}
