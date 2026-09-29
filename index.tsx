import { toasts } from '@unbound-app/api';

export default {
  start() {
    toasts.open({
      message: 'PLUGIN FUNCIONOU!',
      type: 'success',
    });

    console.log('[Unbound Test] iniciado');
  },

  stop() {
    console.log('[Unbound Test] parado');
  },
};
