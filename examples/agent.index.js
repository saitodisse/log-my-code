var Agent = {

  processWrapper(configs) {
    // Merge configs to global confgs
    var acc_keys = 'agent:config_keys';
    _.each(configs, (value, key) => {
      set_config(key, value);
      set_config(acc_keys, [...config(acc_keys)].concat(key));
    });

    // Set process name
    process.title = 'azk-agent ' + config('namespace');
    this.processStateHandler();

    // Start server and subsistems
    return lazy.Server.start().then(() => {
      this.change_status("started");
      lazy.channel.publish("agent:started", {});
      log.info("agent start with pid: " + process.pid);
    });
  },
};

export { Agent };
