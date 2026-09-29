var index = (function () {
'use strict';
var index = {
    start: function start() {
        window.unbound.toasts.open({
            message: 'PLUGIN FUNCIONOU!',
            type: 'success'
        });
        console.log('[Unbound Test] iniciado');
    },
    stop: function stop() {
        console.log('[Unbound Test] parado');
    }
};
return index;
})();