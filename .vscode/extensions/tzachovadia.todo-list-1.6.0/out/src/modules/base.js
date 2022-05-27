"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseModule {
    constructor(config) {
        this.config = config;
    }
    updateConfiguration(config) {
        this.config = config;
        this.onConfigChange();
    }
    onConfigChange() { }
    ;
}
exports.BaseModule = BaseModule;
//# sourceMappingURL=base.js.map