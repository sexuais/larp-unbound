import { metro, patcher, storage, toasts } from '@unbound-app/api';

const unpatches = [];
const store = storage.getStore('sexuais.larp-unbound');

const defaults = {
  enabled: true,
  username: 'LarpUser',
  displayName: 'Larp User',
  userId: '100000000000000000',
  discriminator: '0001',
  badges: {
    nitro: true,
    booster: false,
    hypesquad: false,
    activeDeveloper: true,
    staff: false,
    partner: false
  }
};

function getConfig() {
  const saved = store.get('config') || {};

  return {
    ...defaults,
    ...saved,
    badges: {
      ...defaults.badges,
      ...(saved.badges || {})
    }
  };
}

function saveConfig(config) {
  store.set('config', config);
}

function fakeUser(user) {
  const config = getConfig();

  if (!config.enabled || !user) {
    return user;
  }

  return {
    ...user,
    username: config.username || user.username,
    global_name: config.displayName || user.global_name,
    globalName: config.displayName || user.globalName,
    id: config.userId || user.id,
    discriminator: config.discriminator || user.discriminator,

    __larp: {
      localOnly: true,
      badges: {
        ...config.badges
      }
    }
  };
}

function patchUserStore() {
  const UserStore = metro.findByProps(
    'getCurrentUser',
    'getUser'
  );

  if (!UserStore) {
    throw new Error('Discord UserStore was not found.');
  }

  unpatches.push(
    patcher.after(
      UserStore,
      'getCurrentUser',
      ({ result }) => fakeUser(result)
    )
  );

  unpatches.push(
    patcher.after(
      UserStore,
      'getUser',
      ({ result }) => fakeUser(result)
    )
  );
}

export default {
  start() {
    try {
      patchUserStore();
    } catch (error) {
      console.error('[Larp] failed to start', error);

      try {
        toasts.open({
          content: 'Larp: UserStore não encontrado.',
          type: 'error'
        });
      } catch {}
    }
  },

  stop() {
    for (const unpatch of unpatches) {
      unpatch();
    }

    unpatches.length = 0;
  }
};
