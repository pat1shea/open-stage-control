var {getObjectData, updateDom} = require('./editor/data-workers'),
    widgetManager = require('./managers/widgets')

var callbacks = {
    '/EXEC': function(args) {
        // backward-compatibility
        var [name, ...args] = args
        if (name == 'edit') return callbacks['/EDIT'](args)
        if (name == 'edit_soft') return callbacks['/EDIT_SOFT'](args)
    },
    '/EDIT': function(args) {

        if (READ_ONLY) return

        var [id, json] = args,
            newdata = JSON.parseFlex(json),
            containers = widgetManager.getWidgetById(id)

        if (!containers.length) return
        for (var i=containers.length-1;i>=0;i--) {
            var container = containers[i].container,
                data = containers[i].props

            for (var k in newdata) {
                data[k] = newdata[k]
            }
            updateDom(container,data,true)
        }
    },
    '/EDIT_SOFT': function(args) {

        if (READ_ONLY) return

        var [id, json] = args,
            newdata = JSON.parseFlex(json),
            containers = widgetManager.getWidgetById(id)

        if (!containers.length) return
        for (var i=containers.length-1;i>=0;i--) {
            var container = containers[i].container,
                data = containers[i].props

            $.extend(true,data,newdata)
            updateDom(container,data,true)
        }
    },

    '/GET':function(args) {

        var [target, idOrAddress, ...preArgs] = args,
            widgets = []

        if (idOrAddress[0] == '/') {

            widgets = widgetManager.getWidgetByAddress(
                widgetManager.createAddressRef(null, preArgs, idOrAddress)
            )

        } else {

            widgets = widgetManager.getWidgetById(idOrAddress)

        }

        if (!widgets.length) return

        for (var i = widgets.length - 1; i >= 0; i--) {

            if (typeof target == 'string' && target.indexOf(':') != -1) {
                widgets[i].sendValue({target:[target]})
            } else {
                widgets[i].sendValue()
            }

        }

    },
    '/TABS': function(args) {
        // DEPRECATED

        if (!Array.isArray(args)) args = [args]

        for (let id of args) {
            let ws = widgetManager.getWidgetById(id)
            for (let w of ws) {
                $(`.tablink[data-widget="${w.hash}"]`).trigger('fake-click')
            }
        }

    }
}

module.exports = {
    exec: function(name, args){
        if (callbacks[name]) {
            callbacks[name](args)
        }
    },
    exists: function(name){
        return name in callbacks
    }
}
