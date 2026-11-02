/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/oh-boot.service.ts"
/*!********************************!*\
  !*** ./src/oh-boot.service.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenHereBootService: () => (/* binding */ OpenHereBootService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tabby-core */ "tabby-core");
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tabby_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _oh_pending__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./oh-pending */ "./src/oh-pending.ts");
/* harmony import */ var _oh_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./oh-settings */ "./src/oh-settings.ts");
/* harmony import */ var _oh_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./oh-i18n */ "./src/oh-i18n.ts");
/* harmony import */ var _oh_opener__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./oh-opener */ "./src/oh-opener.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * 新窗口启动引导
 * 在 AppService.ready$ 时消费一次性请求，在新窗口中打开目标目录
 */







let OpenHereBootService = class OpenHereBootService {
    constructor(app, opener, notifications) {
        this.app = app;
        this.opener = opener;
        this.notifications = notifications;
        if (this.app.ready$ && typeof this.app.ready$.subscribe === 'function') {
            this.app.ready$.subscribe(() => {
                void this.processPending();
            });
        }
        else {
            setTimeout(() => {
                void this.processPending();
            }, 1500);
        }
    }
    async processPending() {
        const request = (0,_oh_pending__WEBPACK_IMPORTED_MODULE_3__.consumePendingOpen)();
        if (!request)
            return;
        try {
            if (!fs__WEBPACK_IMPORTED_MODULE_1__.statSync(request.path).isDirectory())
                return;
            const ok = await this.opener.openAt(request.path, (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.getProfileSelection)());
            if (!ok) {
                this.notifications.error('Open Here', (0,_oh_i18n__WEBPACK_IMPORTED_MODULE_5__.t)('未能在新窗口中打开目录。', 'Could not open the directory in the new window.'));
            }
        }
        catch (_a) {
            this.notifications.error('Open Here', (0,_oh_i18n__WEBPACK_IMPORTED_MODULE_5__.t)('未能在新窗口中打开目录。', 'Could not open the directory in the new window.'));
        }
    }
};
OpenHereBootService = __decorate([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable)(),
    __metadata("design:paramtypes", [tabby_core__WEBPACK_IMPORTED_MODULE_2__.AppService,
        _oh_opener__WEBPACK_IMPORTED_MODULE_6__.OpenHereOpenerService,
        tabby_core__WEBPACK_IMPORTED_MODULE_2__.NotificationsService])
], OpenHereBootService);



/***/ },

/***/ "./src/oh-cli-handler.ts"
/*!*******************************!*\
  !*** ./src/oh-cli-handler.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenHereCLIHandler: () => (/* binding */ OpenHereCLIHandler)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tabby-core */ "tabby-core");
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tabby_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _oh_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./oh-settings */ "./src/oh-settings.ts");
/* harmony import */ var _oh_pending__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./oh-pending */ "./src/oh-pending.ts");
/* harmony import */ var _oh_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./oh-util */ "./src/oh-util.ts");
/* harmony import */ var _oh_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./oh-i18n */ "./src/oh-i18n.ts");
/* harmony import */ var _oh_opener__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./oh-opener */ "./src/oh-opener.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * 拦截 Tabby CLI 的 open 命令
 * - 新窗口模式：写入待处理请求并创建新窗口
 * - 新标签页模式：按设置选择 Profile 打开；跟随默认时交还原生逻辑
 */








let OpenHereCLIHandler = class OpenHereCLIHandler extends tabby_core__WEBPACK_IMPORTED_MODULE_2__.CLIHandler {
    constructor(opener, hostApp, notifications) {
        super();
        this.opener = opener;
        this.hostApp = hostApp;
        this.notifications = notifications;
        this.priority = 100;
        this.firstMatchOnly = true;
    }
    async handle(event) {
        if (!event || !event.argv || event.argv._[0] !== 'open')
            return false;
        let directory;
        try {
            directory = (0,_oh_util__WEBPACK_IMPORTED_MODULE_5__.resolveOpenTarget)(event.cwd || process.cwd(), event.argv.directory);
            if (!fs__WEBPACK_IMPORTED_MODULE_1__.statSync(directory).isDirectory())
                return false;
        }
        catch (_a) {
            return false;
        }
        if ((0,_oh_settings__WEBPACK_IMPORTED_MODULE_3__.getOpenMode)() === 'window' && event.secondInstance) {
            try {
                (0,_oh_pending__WEBPACK_IMPORTED_MODULE_4__.createPendingOpen)(directory);
                this.hostApp.newWindow();
                return true;
            }
            catch (_b) {
                // 回退到当前窗口打开
            }
        }
        const selected = (0,_oh_settings__WEBPACK_IMPORTED_MODULE_3__.getProfileSelection)();
        if (!selected || selected === 'default')
            return false;
        try {
            if (await this.opener.openAt(directory, selected)) {
                return true;
            }
        }
        catch (_c) { }
        this.notifications.error('Open Here', (0,_oh_i18n__WEBPACK_IMPORTED_MODULE_6__.t)('未能打开所选 Shell 配置，已回退到 Tabby 默认配置。', 'Could not open the selected shell profile; falling back to Tabby default.'));
        return false;
    }
};
OpenHereCLIHandler = __decorate([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable)(),
    __metadata("design:paramtypes", [_oh_opener__WEBPACK_IMPORTED_MODULE_7__.OpenHereOpenerService,
        tabby_core__WEBPACK_IMPORTED_MODULE_2__.HostAppService,
        tabby_core__WEBPACK_IMPORTED_MODULE_2__.NotificationsService])
], OpenHereCLIHandler);



/***/ },

/***/ "./src/oh-i18n.ts"
/*!************************!*\
  !*** ./src/oh-i18n.ts ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectSystemLocale: () => (/* binding */ detectSystemLocale),
/* harmony export */   effectiveLocale: () => (/* binding */ effectiveLocale),
/* harmony export */   getSavedLocale: () => (/* binding */ getSavedLocale),
/* harmony export */   setSavedLocale: () => (/* binding */ setSavedLocale),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
const LOCALE_KEY = 'oh-locale';
function getSavedLocale() {
    try {
        const value = localStorage.getItem(LOCALE_KEY);
        if (value === 'zh-CN' || value === 'en-US')
            return value;
    }
    catch (_a) { }
    return '';
}
function setSavedLocale(value) {
    try {
        localStorage.setItem(LOCALE_KEY, value || 'auto');
    }
    catch (_a) { }
}
function detectSystemLocale() {
    var _a, _b, _c, _d;
    try {
        const keys = ['locale', 'language', 'tabby-language', 'tabby-locale',
            'config', 'tabby-config', 'settings', 'tabby-settings', 'tabby-config.json'];
        for (const key of keys) {
            const raw = localStorage.getItem(key);
            if (!raw)
                continue;
            if (/^zh/i.test(raw))
                return 'zh-CN';
            if (/^en/i.test(raw))
                return 'en-US';
            try {
                const obj = JSON.parse(raw);
                const lang = ((_a = obj === null || obj === void 0 ? void 0 : obj.appearance) === null || _a === void 0 ? void 0 : _a.language) || ((_b = obj === null || obj === void 0 ? void 0 : obj.appearance) === null || _b === void 0 ? void 0 : _b.locale)
                    || (obj === null || obj === void 0 ? void 0 : obj.language) || (obj === null || obj === void 0 ? void 0 : obj.locale) || ((_c = obj === null || obj === void 0 ? void 0 : obj.app) === null || _c === void 0 ? void 0 : _c.language) || ((_d = obj === null || obj === void 0 ? void 0 : obj.general) === null || _d === void 0 ? void 0 : _d.language);
                if (lang)
                    return /^zh/i.test(String(lang)) ? 'zh-CN' : 'en-US';
            }
            catch (_e) { }
        }
    }
    catch (_f) { }
    try {
        const langs = navigator.languages || [navigator.language];
        if (langs.find(lang => /^zh/i.test(lang)))
            return 'zh-CN';
    }
    catch (_g) { }
    try {
        if (/^zh/i.test(navigator.language || ''))
            return 'zh-CN';
    }
    catch (_h) { }
    return 'en-US';
}
function effectiveLocale() {
    return getSavedLocale() || detectSystemLocale();
}
function t(zh, en) {
    return effectiveLocale() === 'en-US' ? en : zh;
}


/***/ },

/***/ "./src/oh-launcher-exe.ts"
/*!********************************!*\
  !*** ./src/oh-launcher-exe.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LAUNCHER_EXE_BASE64: () => (/* binding */ LAUNCHER_EXE_BASE64),
/* harmony export */   LAUNCHER_VERSION: () => (/* binding */ LAUNCHER_VERSION)
/* harmony export */ });
/**
 * Launcher binary (base64).
 * Generated by launcher/build.ps1 - do not edit manually.
 * Source: launcher/Launcher.cs
 */
const LAUNCHER_VERSION = '1.0.0';
const LAUNCHER_EXE_BASE64 = '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AAAAAAEAJQAAAAAAAAAAAAA8TW9kdWxlPgB0YWJieS5leGUAUHJvZ3JhbQBtc2NvcmxpYgBTeXN0ZW0AT2JqZWN0AE1lc3NhZ2VCb3hXAE1haW4ASXNFeGVjdXRhYmxlAFJlYWRGaXJzdExpbmUAUmVhZFByb3RvY29sUGF0aABQYXJzZVF1b3RlZFBhdGgARmluZENvbW1vblRhYmJ5AFdyaXRlTG9nAC5jdG9yAGhXbmQAdGV4dABjYXB0aW9uAHR5cGUAYXJncwB2YWx1ZQBmaWxlAGNvbW1hbmQAYmFzZURpcgBtZXNzYWdlAFN5c3RlbS5SdW50aW1lLkNvbXBpbGVyU2VydmljZXMAQ29tcGlsYXRpb25SZWxheGF0aW9uc0F0dHJpYnV0ZQBSdW50aW1lQ29tcGF0aWJpbGl0eUF0dHJpYnV0ZQB0YWJieQBTeXN0ZW0uUnVudGltZS5JbnRlcm9wU2VydmljZXMARGxsSW1wb3J0QXR0cmlidXRlAHVzZXIzMi5kbGwARW52aXJvbm1lbnQAZ2V0X0N1cnJlbnREaXJlY3RvcnkAU3RyaW5nAEVtcHR5AFRyaW0AZ2V0X0xlbmd0aABnZXRfQ2hhcnMAU3Vic3RyaW5nAEV4cGFuZEVudmlyb25tZW50VmFyaWFibGVzAEVuZHNXaXRoAFN5c3RlbS5JTwBGaWxlAEV4aXN0cwBQYXRoAEdldERpcmVjdG9yeU5hbWUASXNOdWxsT3JFbXB0eQBEaXJlY3RvcnkAR2V0RW52aXJvbm1lbnRWYXJpYWJsZQBTcGVjaWFsRm9sZGVyAEdldEZvbGRlclBhdGgAQ29tYmluZQBDb25jYXQASW50UHRyAFplcm8AU3lzdGVtLkRpYWdub3N0aWNzAFByb2Nlc3NTdGFydEluZm8Ac2V0X0ZpbGVOYW1lAHNldF9Bcmd1bWVudHMAc2V0X1dvcmtpbmdEaXJlY3RvcnkAc2V0X1VzZVNoZWxsRXhlY3V0ZQBzZXRfQ3JlYXRlTm9XaW5kb3cAUHJvY2VzcwBTdGFydABFeGNlcHRpb24AZ2V0X01lc3NhZ2UAU3RyaW5nQ29tcGFyaXNvbgBSZWFkQWxsTGluZXMATWljcm9zb2Z0LldpbjMyAFJlZ2lzdHJ5AFJlZ2lzdHJ5S2V5AEN1cnJlbnRVc2Vy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';


/***/ },

/***/ "./src/oh-opener.ts"
/*!**************************!*\
  !*** ./src/oh-opener.ts ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenHereOpenerService: () => (/* binding */ OpenHereOpenerService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tabby-core */ "tabby-core");
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tabby_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _oh_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./oh-util */ "./src/oh-util.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * 按 Profile + 目录打开 Tabby 标签页
 */



let OpenHereOpenerService = class OpenHereOpenerService {
    constructor(profiles, config, hostWindow) {
        this.profiles = profiles;
        this.config = config;
        this.hostWindow = hostWindow;
    }
    async resolveProfile(selected) {
        var _a, _b;
        const all = await this.profiles.getProfiles();
        const selectable = (0,_oh_util__WEBPACK_IMPORTED_MODULE_2__.getSelectableProfiles)(all);
        if (selected && selected !== 'default') {
            return selectable.find(profile => profile.id === selected) || null;
        }
        return (0,_oh_util__WEBPACK_IMPORTED_MODULE_2__.resolveDefaultProfile)(all, (_b = (_a = this.config.store) === null || _a === void 0 ? void 0 : _a.terminal) === null || _b === void 0 ? void 0 : _b.profile);
    }
    async openAt(directory, selected) {
        const profile = await this.resolveProfile(selected);
        if (!profile)
            return false;
        const full = this.profiles.getConfigProxyForProfile(profile);
        const withCwd = {
            ...full,
            options: {
                ...(full.options || {}),
                cwd: directory,
            },
        };
        await this.profiles.openNewTabForProfile(withCwd);
        this.hostWindow.bringToFront();
        return true;
    }
};
OpenHereOpenerService = __decorate([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable)(),
    __metadata("design:paramtypes", [tabby_core__WEBPACK_IMPORTED_MODULE_1__.ProfilesService,
        tabby_core__WEBPACK_IMPORTED_MODULE_1__.ConfigService,
        tabby_core__WEBPACK_IMPORTED_MODULE_1__.HostWindowService])
], OpenHereOpenerService);



/***/ },

/***/ "./src/oh-pending.ts"
/*!***************************!*\
  !*** ./src/oh-pending.ts ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   consumePendingOpen: () => (/* binding */ consumePendingOpen),
/* harmony export */   createPendingOpen: () => (/* binding */ createPendingOpen)
/* harmony export */ });
/* harmony import */ var _oh_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oh-util */ "./src/oh-util.ts");
/**
 * 新窗口交接请求
 * 写入后由新窗口的 boot service 消费；带 10 秒 TTL
 */

function createPendingOpen(target) {
    const request = {
        path: target,
        ts: Date.now(),
        id: Math.random().toString(36).slice(2),
    };
    try {
        localStorage.setItem(_oh_util__WEBPACK_IMPORTED_MODULE_0__.PENDING_KEY, JSON.stringify(request));
    }
    catch (_a) { }
}
function consumePendingOpen() {
    let raw = null;
    try {
        raw = localStorage.getItem(_oh_util__WEBPACK_IMPORTED_MODULE_0__.PENDING_KEY);
    }
    catch (_a) {
        return null;
    }
    if (!raw)
        return null;
    try {
        localStorage.removeItem(_oh_util__WEBPACK_IMPORTED_MODULE_0__.PENDING_KEY);
    }
    catch (_b) { }
    return (0,_oh_util__WEBPACK_IMPORTED_MODULE_0__.parsePendingRequest)(raw, Date.now());
}


/***/ },

/***/ "./src/oh-settings.component.ts"
/*!**************************************!*\
  !*** ./src/oh-settings.component.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenHereSettingsComponent: () => (/* binding */ OpenHereSettingsComponent),
/* harmony export */   OpenHereSettingsTabProvider: () => (/* binding */ OpenHereSettingsTabProvider)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tabby-core */ "tabby-core");
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tabby_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tabby_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tabby-settings */ "tabby-settings");
/* harmony import */ var tabby_settings__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tabby_settings__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _oh_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./oh-i18n */ "./src/oh-i18n.ts");
/* harmony import */ var _oh_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./oh-settings */ "./src/oh-settings.ts");
/* harmony import */ var _oh_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./oh-util */ "./src/oh-util.ts");
/* harmony import */ var _oh_win__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./oh-win */ "./src/oh-win.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Open Here 设置页
 * 功能描述：语言、Windows 集成安装/卸载、默认 Shell、打开方式、Tabby 路径
 */







let OpenHereSettingsComponent = class OpenHereSettingsComponent {
    constructor(profilesService) {
        this.profilesService = profilesService;
        this.lang = (0,_oh_i18n__WEBPACK_IMPORTED_MODULE_3__.getSavedLocale)();
        this.tabbyPath = (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.getTabbyPath)();
        this.profile = (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.getProfileSelection)();
        this.openMode = (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.getOpenMode)();
        this.profiles = [];
        this.status = null;
        this.busy = false;
        this.message = '';
        this.messageOk = true;
        this.version = '1.0.0';
    }
    async ngOnInit() {
        await this.reloadProfiles();
        await this.refreshStatus();
        if (!this.tabbyPath) {
            await this.detect();
        }
    }
    t(zh, en) {
        return (0,_oh_i18n__WEBPACK_IMPORTED_MODULE_3__.effectiveLocale)() === 'en-US' ? en : zh;
    }
    get pathValid() {
        return (0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.tabbyPathExists)(this.tabbyPath);
    }
    get statusText() {
        if (!this.status)
            return this.t('检查中...', 'Checking...');
        if (this.status.installed)
            return this.t('已安装', 'Installed');
        if (this.status.appPathOccupied)
            return this.t('地址栏命令被占用', 'Address bar command in use');
        if (this.status.needsRepair)
            return this.t('需修复', 'Needs repair');
        return this.t('未安装', 'Not installed');
    }
    get statusClass() {
        if (!this.status)
            return 'oh-pill-neutral';
        if (this.status.installed)
            return 'oh-pill-ok';
        if (this.status.appPathOccupied || this.status.needsRepair)
            return 'oh-pill-warn';
        return 'oh-pill-neutral';
    }
    get hasIntegration() {
        return !!this.status && (this.status.launcherExists ||
            this.status.contextMenuCount > 0 ||
            (this.status.appPathExists && !this.status.appPathOccupied));
    }
    async reloadProfiles() {
        try {
            this.profiles = (0,_oh_util__WEBPACK_IMPORTED_MODULE_5__.getSelectableProfiles)(await this.profilesService.getProfiles());
        }
        catch (_a) {
            this.profiles = [];
        }
        if (this.profile !== 'default' && !this.profiles.find(item => item.id === this.profile)) {
            this.profile = 'default';
            (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.setProfileSelection)('default');
        }
    }
    async refreshStatus() {
        try {
            this.status = await (0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.getStatus)();
        }
        catch (_a) {
            this.status = null;
        }
    }
    onLangChange() {
        ;(0,_oh_i18n__WEBPACK_IMPORTED_MODULE_3__.setSavedLocale)(this.lang);
        this.message = '';
    }
    onProfileChange() {
        ;(0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.setProfileSelection)(this.profile);
    }
    onModeChange() {
        ;(0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.setOpenMode)(this.openMode);
    }
    onPathCommit() {
        var _a;
        (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.setTabbyPath)(this.tabbyPath);
        if (!((_a = this.status) === null || _a === void 0 ? void 0 : _a.installed) || !this.pathValid)
            return;
        (0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.updateTabbyPath)(this.tabbyPath)
            .then(() => this.refreshStatus())
            .then(() => this.setMessage(this.t('Tabby 路径已更新。', 'Tabby path updated.'), true))
            .catch(error => this.setMessage(this.errorText(error), false));
    }
    async detect() {
        var _a;
        try {
            const detected = await (0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.detectTabbyPath)();
            if (!detected) {
                this.setMessage(this.t('未检测到 Tabby.exe，请手动选择。', 'Tabby.exe was not detected; choose it manually.'), false);
                return;
            }
            this.tabbyPath = detected;
            (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.setTabbyPath)(detected);
            if ((_a = this.status) === null || _a === void 0 ? void 0 : _a.installed) {
                await (0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.updateTabbyPath)(detected);
                await this.refreshStatus();
            }
            this.setMessage(this.t('已检测到 Tabby 路径。', 'Tabby path detected.'), true);
        }
        catch (error) {
            this.setMessage(this.errorText(error), false);
        }
    }
    async browse() {
        try {
            const remote = window.require('@electron/remote');
            const result = await remote.dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{ name: 'Tabby', extensions: ['exe'] }],
            });
            if (!result.canceled && result.filePaths && result.filePaths[0]) {
                this.tabbyPath = result.filePaths[0];
                this.onPathCommit();
            }
        }
        catch (_a) {
            this.setMessage(this.t('当前环境无法打开文件选择器，请手动输入路径。', 'File picker unavailable; enter the path manually.'), false);
        }
    }
    async installIntegration() {
        var _a;
        if (this.busy)
            return;
        const path = (this.tabbyPath || '').trim();
        if (!(0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.tabbyPathExists)(path)) {
            this.setMessage(this.t('请先选择有效的 Tabby.exe 路径。', 'Please choose a valid Tabby.exe path.'), false);
            return;
        }
        await this.refreshStatus();
        if ((_a = this.status) === null || _a === void 0 ? void 0 : _a.appPathOccupied) {
            const ok = confirm(this.t('地址栏命令 tabby 已被其他程序注册，继续安装会覆盖它。是否继续？', 'The tabby command is registered by another program. Continue and overwrite it?'));
            if (!ok)
                return;
        }
        this.busy = true;
        this.message = '';
        try {
            (0,_oh_settings__WEBPACK_IMPORTED_MODULE_4__.setTabbyPath)(path);
            await (0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.install)({
                tabbyPath: path,
                contextLabel: this.t('在 Tabby 中打开', 'Open in Tabby'),
            });
            await this.refreshStatus();
            this.setMessage(this.t('Windows 集成已安装。', 'Windows integration installed.'), true);
        }
        catch (error) {
            this.setMessage(this.errorText(error), false);
        }
        finally {
            this.busy = false;
        }
    }
    async uninstallIntegration() {
        if (this.busy)
            return;
        const ok = confirm(this.t('确定卸载 Windows 集成吗？将删除地址栏命令和右键菜单。', 'Uninstall the Windows integration? This removes the address bar command and context menu.'));
        if (!ok)
            return;
        this.busy = true;
        this.message = '';
        try {
            await (0,_oh_win__WEBPACK_IMPORTED_MODULE_6__.uninstall)();
            await this.refreshStatus();
            this.setMessage(this.t('Windows 集成已卸载。', 'Windows integration uninstalled.'), true);
        }
        catch (error) {
            this.setMessage(this.errorText(error), false);
        }
        finally {
            this.busy = false;
        }
    }
    openGithub() {
        const url = 'https://github.com/iishen717/Tabby-Open-Here';
        try {
            window.require('electron').shell.openExternal(url);
        }
        catch (_a) {
            try {
                window.open(url, '_blank');
            }
            catch (_b) {
                location.href = url;
            }
        }
    }
    setMessage(text, ok) {
        this.message = text;
        this.messageOk = ok;
    }
    errorText(error) {
        return String((error && error.message) || error || this.t('未知错误', 'Unknown error'));
    }
};
OpenHereSettingsComponent = __decorate([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.Component)({
        selector: 'oh-settings',
        template: `
    <div class="oh-page">
      <h3 class="oh-title">Open Here</h3>
      <p class="oh-desc">{{ t('在资源管理器地址栏输入 tabby，或在文件夹右键菜单中选择「在 Tabby 中打开」。', 'Type tabby in the Explorer address bar, or use "Open in Tabby" in the folder context menu.') }}</p>

      <div class="oh-section">
        <label class="oh-label">{{ t('语言', 'Language') }}</label>
        <select class="oh-select" [(ngModel)]="lang" (ngModelChange)="onLangChange()">
          <option value="">{{ t('自动', 'Auto') }}</option>
          <option value="zh-CN">中文</option>
          <option value="en-US">English</option>
        </select>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('Windows 集成', 'Windows Integration') }}</label>
        <div class="oh-status-row">
          <span class="oh-pill" [ngClass]="statusClass">{{ statusText }}</span>
          <span class="oh-status-detail" *ngIf="status">
            {{ t('地址栏命令', 'Address bar command') }}: <code>tabby</code> ·
            {{ t('右键菜单', 'Context menu') }}: {{ status.contextMenuCount }}/4
          </span>
        </div>
        <p class="oh-hint" *ngIf="status?.appPathOccupied">
          {{ t('地址栏命令 tabby 已被其他程序注册。', 'The tabby command is registered by another program.') }}
        </p>
        <div class="oh-btn-row">
          <button class="oh-btn oh-btn-primary" [disabled]="busy" (click)="installIntegration()">
            {{ busy ? t('处理中...', 'Working...') : (status?.installed ? t('更新集成', 'Update Integration') : (status?.needsRepair ? t('修复集成', 'Repair Integration') : t('安装集成', 'Install Integration'))) }}
          </button>
          <button class="oh-btn oh-btn-danger" [disabled]="busy || !hasIntegration" (click)="uninstallIntegration()">
            {{ t('卸载集成', 'Uninstall Integration') }}
          </button>
        </div>
        <p class="oh-msg" *ngIf="message" [class.oh-msg-error]="!messageOk">{{ message }}</p>
        <p class="oh-hint">{{ t('Windows 11 的右键菜单在「显示更多选项」中。', 'On Windows 11, the context menu is under "Show more options".') }}</p>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('打开方式', 'Open Behavior') }}</label>
        <label class="oh-sub-label">{{ t('默认 Shell', 'Default Shell') }}</label>
        <select class="oh-select" [(ngModel)]="profile" (ngModelChange)="onProfileChange()">
          <option value="default">{{ t('跟随 Tabby 默认', 'Follow Tabby default') }}</option>
          <option *ngFor="let item of profiles" [value]="item.id">{{ item.name }}</option>
        </select>
        <p class="oh-hint">{{ t('WSL Profile 暂不支持（Windows 路径无法可靠映射）。', 'WSL profiles are not listed (Windows paths cannot be mapped reliably).') }}</p>

        <label class="oh-sub-label">{{ t('打开位置', 'Open In') }}</label>
        <div class="oh-radio-row">
          <label class="oh-radio" [class.oh-radio-active]="openMode === 'tab'">
            <input type="radio" name="oh-mode" value="tab" [(ngModel)]="openMode" (ngModelChange)="onModeChange()" />
            <span>{{ t('现有窗口新标签页', 'New tab in current window') }}</span>
          </label>
          <label class="oh-radio" [class.oh-radio-active]="openMode === 'window'">
            <input type="radio" name="oh-mode" value="window" [(ngModel)]="openMode" (ngModelChange)="onModeChange()" />
            <span>{{ t('新窗口', 'New window') }}</span>
          </label>
        </div>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('Tabby 路径', 'Tabby Path') }}</label>
        <div class="oh-path-row">
          <input class="oh-input" type="text" [(ngModel)]="tabbyPath" (change)="onPathCommit()" [placeholder]="t('Tabby.exe 的完整路径', 'Full path to Tabby.exe')" />
          <button class="oh-btn" (click)="browse()">{{ t('浏览', 'Browse') }}</button>
          <button class="oh-btn" (click)="detect()">{{ t('自动检测', 'Detect') }}</button>
        </div>
        <p class="oh-hint oh-hint-error" *ngIf="tabbyPath && !pathValid">
          {{ t('该路径不存在或不是 exe 文件。', 'This path does not exist or is not an exe file.') }}
        </p>
        <p class="oh-hint">{{ t('修改路径后，如已安装集成会自动更新启动器配置。', 'If the integration is installed, changing the path updates the launcher configuration automatically.') }}</p>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('关于', 'About') }}</label>
        <div class="oh-about">
          <span>{{ t('版本', 'Version') }}: {{ version }}</span>
          <span>{{ t('作者', 'Author') }}: iishen717</span>
          <span class="oh-link" (click)="openGithub()">GitHub</span>
        </div>
      </div>
    </div>
  `,
        styles: [`
    .oh-page { padding: 20px; max-width: 640px; }
    .oh-title { color: var(--primary-color, #3b82f6); font-size: 18px; margin-bottom: 6px; }
    .oh-desc { opacity: .7; font-size: 13px; line-height: 1.6; margin-bottom: 24px; }
    .oh-section { border-top: 1px solid rgba(128,128,128,0.2); padding-top: 16px; margin-bottom: 16px; }
    .oh-label { display: block; font-size: 16px; font-weight: 600; margin-bottom: 10px; }
    .oh-sub-label { display: block; font-size: 13px; font-weight: 500; margin: 10px 0 6px; }
    .oh-select, .oh-input {
      width: 100%; max-width: 420px; padding: 7px 10px; border-radius: 6px;
      background: rgba(128,128,128,0.1); border: 1px solid rgba(128,128,128,0.25);
      font-size: 13px; outline: none; color: inherit; box-sizing: border-box;
    }
    .oh-select { cursor: pointer; }
    .oh-select option { color: #000; background: #fff; }
    .oh-select:focus, .oh-input:focus { border-color: var(--primary-color, #3b82f6); }
    .oh-status-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
    .oh-pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .oh-pill-ok { background: rgba(52,211,153,.15); color: #10b981; }
    .oh-pill-warn { background: rgba(251,146,60,.15); color: #f59e0b; }
    .oh-pill-neutral { background: rgba(128,128,128,.15); color: inherit; opacity: .8; }
    .oh-status-detail { font-size: 12px; opacity: .7; }
    .oh-status-detail code { font-family: monospace; font-size: 12px; }
    .oh-btn-row, .oh-path-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .oh-path-row .oh-input { flex: 1; min-width: 220px; }
    .oh-btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
      border-radius: 8px; border: 1px solid rgba(128,128,128,0.25);
      background: rgba(128,128,128,0.08); font-size: 13px; cursor: pointer;
      transition: background .15s; color: inherit; white-space: nowrap;
    }
    .oh-btn:hover:not(:disabled) { background: rgba(128,128,128,0.15); }
    .oh-btn:disabled { opacity: .5; cursor: default; }
    .oh-btn-primary { border-color: var(--primary-color, #3b82f6); color: var(--primary-color, #3b82f6); }
    .oh-btn-danger { border-color: #e24b4a; color: #e24b4a; }
    .oh-hint { font-size: 12px; opacity: .65; line-height: 1.5; margin: 8px 0 0; }
    .oh-hint-error { color: #e24b4a; opacity: 1; }
    .oh-msg { margin: 10px 0 0; font-size: 12px; color: #10b981; line-height: 1.5; }
    .oh-msg-error { color: #e24b4a; }
    .oh-radio-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
    .oh-radio {
      display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
      border-radius: 6px; border: 1px solid rgba(128,128,128,0.25);
      cursor: pointer; transition: all .15s; user-select: none; font-size: 13px;
    }
    .oh-radio:hover { border-color: var(--primary-color, #3b82f6); }
    .oh-radio-active { border-color: var(--primary-color, #3b82f6); background: rgba(59,130,246,.08); }
    .oh-radio input { margin: 0; }
    .oh-about { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; opacity: .8; }
    .oh-link { color: var(--primary-color, #3b82f6); cursor: pointer; }
    .oh-link:hover { text-decoration: underline; }
  `],
    }),
    __metadata("design:paramtypes", [tabby_core__WEBPACK_IMPORTED_MODULE_1__.ProfilesService])
], OpenHereSettingsComponent);

let OpenHereSettingsTabProvider = class OpenHereSettingsTabProvider extends tabby_settings__WEBPACK_IMPORTED_MODULE_2__.SettingsTabProvider {
    constructor() {
        super(...arguments);
        this.id = 'oh-settings';
        this.icon = 'fas fa-folder-open';
        this.title = 'Open Here';
    }
    getComponentType() {
        return OpenHereSettingsComponent;
    }
    async getSettingsTabs() {
        return [{
                title: 'Open Here',
                icon: 'fas fa-folder-open',
                weight: 97,
                component: OpenHereSettingsComponent,
            }];
    }
};
OpenHereSettingsTabProvider = __decorate([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable)()
], OpenHereSettingsTabProvider);



/***/ },

/***/ "./src/oh-settings.ts"
/*!****************************!*\
  !*** ./src/oh-settings.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOpenMode: () => (/* binding */ getOpenMode),
/* harmony export */   getProfileSelection: () => (/* binding */ getProfileSelection),
/* harmony export */   getTabbyPath: () => (/* binding */ getTabbyPath),
/* harmony export */   setOpenMode: () => (/* binding */ setOpenMode),
/* harmony export */   setProfileSelection: () => (/* binding */ setProfileSelection),
/* harmony export */   setTabbyPath: () => (/* binding */ setTabbyPath)
/* harmony export */ });
const PATH_KEY = 'oh-tabby-path';
const PROFILE_KEY = 'oh-profile';
const MODE_KEY = 'oh-open-mode';
function read(key) {
    try {
        return localStorage.getItem(key) || '';
    }
    catch (_a) {
        return '';
    }
}
function write(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (_a) { }
}
function getTabbyPath() {
    return read(PATH_KEY);
}
function setTabbyPath(value) {
    write(PATH_KEY, value || '');
}
function getProfileSelection() {
    return read(PROFILE_KEY) || 'default';
}
function setProfileSelection(value) {
    write(PROFILE_KEY, value || 'default');
}
function getOpenMode() {
    return read(MODE_KEY) === 'window' ? 'window' : 'tab';
}
function setOpenMode(value) {
    write(MODE_KEY, value === 'window' ? 'window' : 'tab');
}


/***/ },

/***/ "./src/oh-util.ts"
/*!************************!*\
  !*** ./src/oh-util.ts ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   APP_PATHS_KEY: () => (/* binding */ APP_PATHS_KEY),
/* harmony export */   APP_PATHS_MARKER_NAME: () => (/* binding */ APP_PATHS_MARKER_NAME),
/* harmony export */   APP_PATHS_MARKER_VALUE: () => (/* binding */ APP_PATHS_MARKER_VALUE),
/* harmony export */   CONTEXT_MENU_KEY_ROOTS: () => (/* binding */ CONTEXT_MENU_KEY_ROOTS),
/* harmony export */   PENDING_KEY: () => (/* binding */ PENDING_KEY),
/* harmony export */   PENDING_TTL_MS: () => (/* binding */ PENDING_TTL_MS),
/* harmony export */   buildAppPathsRegArgs: () => (/* binding */ buildAppPathsRegArgs),
/* harmony export */   buildContextMenuCommand: () => (/* binding */ buildContextMenuCommand),
/* harmony export */   buildContextMenuRegArgs: () => (/* binding */ buildContextMenuRegArgs),
/* harmony export */   findProfileById: () => (/* binding */ findProfileById),
/* harmony export */   getSelectableProfiles: () => (/* binding */ getSelectableProfiles),
/* harmony export */   normalizeTabbyPath: () => (/* binding */ normalizeTabbyPath),
/* harmony export */   parsePendingRequest: () => (/* binding */ parsePendingRequest),
/* harmony export */   parseRegDefaultValue: () => (/* binding */ parseRegDefaultValue),
/* harmony export */   parseTabbyPathFromProtocolCommand: () => (/* binding */ parseTabbyPathFromProtocolCommand),
/* harmony export */   resolveDefaultProfile: () => (/* binding */ resolveDefaultProfile),
/* harmony export */   resolveOpenTarget: () => (/* binding */ resolveOpenTarget)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Open Here 纯工具函数
 * 功能描述：路径解析、注册表参数构造、待处理请求校验、Profile 过滤
 * 说明：不依赖 Angular / Tabby，便于 Node 单元测试
 */

const APP_PATHS_KEY = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\tabby.exe';
const APP_PATHS_MARKER_NAME = 'OpenHereMarker';
const APP_PATHS_MARKER_VALUE = 'tabby-open-here';
const CONTEXT_MENU_KEY_ROOTS = [
    'HKCU\\Software\\Classes\\Directory\\shell\\TabbyOpenHere',
    'HKCU\\Software\\Classes\\Directory\\Background\\shell\\TabbyOpenHere',
    'HKCU\\Software\\Classes\\Drive\\shell\\TabbyOpenHere',
    'HKCU\\Software\\Classes\\Drive\\Background\\shell\\TabbyOpenHere',
];
const PENDING_KEY = 'oh-pending-open';
const PENDING_TTL_MS = 10000;
function resolveOpenTarget(cwd, directory) {
    return path__WEBPACK_IMPORTED_MODULE_0__.resolve(cwd || '.', directory || '.');
}
function normalizeTabbyPath(value) {
    if (!value)
        return null;
    let result = String(value).trim();
    if (result.length >= 2 && result.startsWith('"') && result.endsWith('"')) {
        result = result.slice(1, -1).trim();
    }
    return result || null;
}
function parseTabbyPathFromProtocolCommand(command) {
    if (!command)
        return null;
    const text = command.trim();
    if (!text)
        return null;
    if (text[0] === '"') {
        const end = text.indexOf('"', 1);
        return end > 1 ? text.slice(1, end) : null;
    }
    const match = /^([^\s]+)/.exec(text);
    return match ? match[1] : null;
}
function parseRegDefaultValue(output) {
    if (!output)
        return null;
    for (const line of output.split(/\r?\n/)) {
        const match = line.match(/\s(?:REG_SZ|REG_EXPAND_SZ)\s+(.*)$/);
        if (match && match[1].trim())
            return match[1].trim();
    }
    return null;
}
function buildAppPathsRegArgs(launcherPath) {
    return [
        ['add', APP_PATHS_KEY, '/ve', '/d', launcherPath, '/f'],
        ['add', APP_PATHS_KEY, '/v', APP_PATHS_MARKER_NAME, '/d', APP_PATHS_MARKER_VALUE, '/f'],
    ];
}
function buildContextMenuCommand(launcherPath) {
    return `"${launcherPath}" "%V"`;
}
function buildContextMenuRegArgs(launcherPath, tabbyPath, label) {
    const result = [];
    for (const root of CONTEXT_MENU_KEY_ROOTS) {
        result.push(['add', root, '/ve', '/d', label, '/f']);
        result.push(['add', root, '/v', 'Icon', '/d', `"${tabbyPath}"`, '/f']);
        result.push(['add', `${root}\\command`, '/ve', '/d', buildContextMenuCommand(launcherPath), '/f']);
    }
    return result;
}
function parsePendingRequest(raw, now, ttl = PENDING_TTL_MS) {
    if (!raw)
        return null;
    try {
        const value = JSON.parse(raw);
        if (!value || typeof value.path !== 'string' || !value.path)
            return null;
        if (typeof value.ts !== 'number' || !isFinite(value.ts))
            return null;
        if (value.ts > now + 60000)
            return null;
        if (now - value.ts > ttl)
            return null;
        return {
            path: value.path,
            ts: value.ts,
            id: typeof value.id === 'string' ? value.id : '',
        };
    }
    catch (_a) {
        return null;
    }
}
function getSelectableProfiles(profiles) {
    return (profiles || []).filter(profile => !!profile &&
        profile.type === 'local' &&
        !(profile.options && profile.options.fsBase));
}
function resolveDefaultProfile(profiles, configuredId) {
    const selectable = getSelectableProfiles(profiles);
    if (configuredId) {
        const configured = selectable.find(profile => profile.id === configuredId);
        if (configured)
            return configured;
    }
    return selectable.find(profile => profile.isBuiltin) || selectable[0] || null;
}
function findProfileById(profiles, id) {
    return getSelectableProfiles(profiles).find(profile => profile.id === id) || null;
}


/***/ },

/***/ "./src/oh-win.ts"
/*!***********************!*\
  !*** ./src/oh-win.ts ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectTabbyPath: () => (/* binding */ detectTabbyPath),
/* harmony export */   ensureLauncher: () => (/* binding */ ensureLauncher),
/* harmony export */   getBaseDir: () => (/* binding */ getBaseDir),
/* harmony export */   getLauncherPath: () => (/* binding */ getLauncherPath),
/* harmony export */   getPathFile: () => (/* binding */ getPathFile),
/* harmony export */   getStatus: () => (/* binding */ getStatus),
/* harmony export */   getVersionFile: () => (/* binding */ getVersionFile),
/* harmony export */   install: () => (/* binding */ install),
/* harmony export */   tabbyPathExists: () => (/* binding */ tabbyPathExists),
/* harmony export */   uninstall: () => (/* binding */ uninstall),
/* harmony export */   updateTabbyPath: () => (/* binding */ updateTabbyPath),
/* harmony export */   writeTabbyPath: () => (/* binding */ writeTabbyPath)
/* harmony export */ });
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ "child_process");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _oh_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./oh-util */ "./src/oh-util.ts");
/* harmony import */ var _oh_launcher_exe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./oh-launcher-exe */ "./src/oh-launcher-exe.ts");
/**
 * Windows 集成
 * 功能描述：启动器写入、App Paths / 右键菜单注册表安装卸载、状态检测、Tabby 路径检测
 */






function decodeOutput(buffer) {
    try {
        return new TextDecoder('gbk').decode(buffer);
    }
    catch (_a) {
        return buffer.toString('utf8');
    }
}
function runReg(args) {
    return new Promise(resolve => {
        ;(0,child_process__WEBPACK_IMPORTED_MODULE_0__.execFile)('reg.exe', args, { windowsHide: true, encoding: 'buffer' }, (error, stdout, stderr) => {
            const code = error ? (typeof error.code === 'number' ? error.code : 1) : 0;
            resolve({
                code,
                stdout: decodeOutput(Buffer.isBuffer(stdout) ? stdout : Buffer.from(String(stdout || ''))),
                stderr: decodeOutput(Buffer.isBuffer(stderr) ? stderr : Buffer.from(String(stderr || ''))),
            });
        });
    });
}
async function runRegOrThrow(args) {
    const result = await runReg(args);
    if (result.code !== 0) {
        const detail = (result.stderr || result.stdout || '').trim();
        throw new Error(`注册表操作失败 (${args[0]}): ${detail || 'reg.exe exit ' + result.code}`);
    }
}
function getBaseDir() {
    const localAppData = process.env.LOCALAPPDATA || path__WEBPACK_IMPORTED_MODULE_3__.join(os__WEBPACK_IMPORTED_MODULE_2__.homedir(), 'AppData', 'Local');
    return path__WEBPACK_IMPORTED_MODULE_3__.join(localAppData, 'TabbyOpenHere');
}
function getLauncherPath() {
    return path__WEBPACK_IMPORTED_MODULE_3__.join(getBaseDir(), 'tabby.exe');
}
function getPathFile() {
    return path__WEBPACK_IMPORTED_MODULE_3__.join(getBaseDir(), 'tabby-path.txt');
}
function getVersionFile() {
    return path__WEBPACK_IMPORTED_MODULE_3__.join(getBaseDir(), 'launcher-version.txt');
}
function tabbyPathExists(value) {
    const normalized = (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.normalizeTabbyPath)(value);
    return !!normalized && /\.exe$/i.test(normalized) && fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(normalized);
}
function ensureLauncher() {
    if (!_oh_launcher_exe__WEBPACK_IMPORTED_MODULE_5__.LAUNCHER_EXE_BASE64) {
        throw new Error('启动器未构建，请先运行 npm run build:launcher。');
    }
    fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(getBaseDir(), { recursive: true });
    let current = '';
    try {
        current = fs__WEBPACK_IMPORTED_MODULE_1__.readFileSync(getVersionFile(), 'utf8').trim();
    }
    catch (_a) { }
    if (current !== _oh_launcher_exe__WEBPACK_IMPORTED_MODULE_5__.LAUNCHER_VERSION || !fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(getLauncherPath())) {
        fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync(getLauncherPath(), Buffer.from(_oh_launcher_exe__WEBPACK_IMPORTED_MODULE_5__.LAUNCHER_EXE_BASE64, 'base64'));
        fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync(getVersionFile(), _oh_launcher_exe__WEBPACK_IMPORTED_MODULE_5__.LAUNCHER_VERSION, 'utf8');
    }
}
function writeTabbyPath(tabbyPath) {
    const normalized = (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.normalizeTabbyPath)(tabbyPath);
    if (!normalized)
        throw new Error('Tabby 路径为空。');
    fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(getBaseDir(), { recursive: true });
    fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync(getPathFile(), normalized, 'utf8');
}
async function getStatus() {
    const baseDir = getBaseDir();
    const launcherPath = getLauncherPath();
    const launcherExists = fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(launcherPath);
    const pathFileExists = fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(getPathFile());
    const versionFileExists = fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(getVersionFile());
    const appPathExists = (await runReg(['query', _oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_KEY, '/ve'])).code === 0;
    const marker = await runReg(['query', _oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_KEY, '/v', _oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_MARKER_NAME]);
    const ours = marker.code === 0 && marker.stdout.includes(_oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_MARKER_VALUE);
    let contextMenuCount = 0;
    for (const key of _oh_util__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_MENU_KEY_ROOTS) {
        if ((await runReg(['query', key, '/ve'])).code === 0)
            contextMenuCount++;
    }
    const installed = launcherExists && pathFileExists && versionFileExists && ours &&
        contextMenuCount === _oh_util__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_MENU_KEY_ROOTS.length;
    const needsRepair = !installed &&
        (launcherExists || pathFileExists || versionFileExists || ours || contextMenuCount > 0);
    return {
        installed,
        needsRepair,
        appPathOccupied: appPathExists && !ours,
        appPathExists,
        launcherExists,
        pathFileExists,
        versionFileExists,
        contextMenuCount,
        baseDir,
        launcherPath,
    };
}
async function install(options) {
    const tabbyPath = (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.normalizeTabbyPath)(options.tabbyPath);
    if (!tabbyPath)
        throw new Error('Tabby 路径为空。');
    if (!/\.exe$/i.test(tabbyPath))
        throw new Error('请选择 Tabby.exe。');
    if (!fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(tabbyPath))
        throw new Error(`Tabby.exe 不存在：${tabbyPath}`);
    ensureLauncher();
    writeTabbyPath(tabbyPath);
    for (const args of (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.buildAppPathsRegArgs)(getLauncherPath())) {
        await runRegOrThrow(args);
    }
    for (const args of (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.buildContextMenuRegArgs)(getLauncherPath(), tabbyPath, options.contextLabel)) {
        await runRegOrThrow(args);
    }
}
async function updateTabbyPath(tabbyPath) {
    const normalized = (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.normalizeTabbyPath)(tabbyPath);
    if (!normalized)
        throw new Error('Tabby 路径为空。');
    if (!/\.exe$/i.test(normalized))
        throw new Error('请选择 Tabby.exe。');
    if (!fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(normalized))
        throw new Error(`Tabby.exe 不存在：${normalized}`);
    ensureLauncher();
    writeTabbyPath(normalized);
    for (const root of _oh_util__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_MENU_KEY_ROOTS) {
        await runRegOrThrow(['add', root, '/v', 'Icon', '/d', `"${normalized}"`, '/f']);
    }
}
async function uninstall() {
    const marker = await runReg(['query', _oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_KEY, '/v', _oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_MARKER_NAME]);
    if (marker.code === 0 && marker.stdout.includes(_oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_MARKER_VALUE)) {
        await runReg(['delete', _oh_util__WEBPACK_IMPORTED_MODULE_4__.APP_PATHS_KEY, '/f']);
    }
    for (const key of _oh_util__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_MENU_KEY_ROOTS) {
        await runReg(['delete', key, '/f']);
    }
    try {
        fs__WEBPACK_IMPORTED_MODULE_1__.rmSync(getBaseDir(), { recursive: true, force: true });
    }
    catch (_a) { }
}
async function detectTabbyPath() {
    const execPath = process.execPath || '';
    if (/tabby\.exe$/i.test(execPath) && fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(execPath)) {
        return execPath;
    }
    const protocol = await runReg(['query', 'HKCU\\Software\\Classes\\tabby\\shell\\open\\command', '/ve']);
    if (protocol.code === 0) {
        const command = (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.parseRegDefaultValue)(protocol.stdout);
        const parsed = (0,_oh_util__WEBPACK_IMPORTED_MODULE_4__.parseTabbyPathFromProtocolCommand)(command);
        if (parsed && fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(parsed))
            return parsed;
    }
    const candidates = [
        process.env.LOCALAPPDATA ? path__WEBPACK_IMPORTED_MODULE_3__.join(process.env.LOCALAPPDATA, 'Programs', 'tabby', 'Tabby.exe') : '',
        process.env.ProgramFiles ? path__WEBPACK_IMPORTED_MODULE_3__.join(process.env.ProgramFiles, 'Tabby', 'Tabby.exe') : '',
        process.env['ProgramFiles(x86)'] ? path__WEBPACK_IMPORTED_MODULE_3__.join(process.env['ProgramFiles(x86)'], 'Tabby', 'Tabby.exe') : '',
    ].filter(Boolean);
    for (const candidate of candidates) {
        if (fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(candidate))
            return candidate;
    }
    return execPath;
}


/***/ },

/***/ "@angular/common"
/*!**********************************!*\
  !*** external "@angular/common" ***!
  \**********************************/
(module) {

module.exports = require("@angular/common");

/***/ },

/***/ "@angular/core"
/*!********************************!*\
  !*** external "@angular/core" ***!
  \********************************/
(module) {

module.exports = require("@angular/core");

/***/ },

/***/ "@angular/forms"
/*!*********************************!*\
  !*** external "@angular/forms" ***!
  \*********************************/
(module) {

module.exports = require("@angular/forms");

/***/ },

/***/ "child_process"
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
(module) {

module.exports = require("child_process");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ },

/***/ "os"
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
(module) {

module.exports = require("os");

/***/ },

/***/ "path"
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
(module) {

module.exports = require("path");

/***/ },

/***/ "tabby-core"
/*!*****************************!*\
  !*** external "tabby-core" ***!
  \*****************************/
(module) {

module.exports = require("tabby-core");

/***/ },

/***/ "tabby-settings"
/*!*********************************!*\
  !*** external "tabby-settings" ***!
  \*********************************/
(module) {

module.exports = require("tabby-settings");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "@angular/common");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_angular_common__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "@angular/forms");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_angular_forms__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "@angular/core");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_angular_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tabby-core */ "tabby-core");
/* harmony import */ var tabby_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tabby_core__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var tabby_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tabby-settings */ "tabby-settings");
/* harmony import */ var tabby_settings__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(tabby_settings__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _oh_cli_handler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./oh-cli-handler */ "./src/oh-cli-handler.ts");
/* harmony import */ var _oh_boot_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./oh-boot.service */ "./src/oh-boot.service.ts");
/* harmony import */ var _oh_opener__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./oh-opener */ "./src/oh-opener.ts");
/* harmony import */ var _oh_settings_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./oh-settings.component */ "./src/oh-settings.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Open Here 插件入口
 * 功能描述：注册 CLIHandler（拦截 open）+ 设置页
 */









let OpenHereModule = class OpenHereModule {
    constructor(injector) {
        injector.get(_oh_boot_service__WEBPACK_IMPORTED_MODULE_6__.OpenHereBootService);
        console.log('[OpenHere] Module loaded OK');
    }
};
OpenHereModule = __decorate([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule,
            (tabby_core__WEBPACK_IMPORTED_MODULE_3___default()),
        ],
        declarations: [
            _oh_settings_component__WEBPACK_IMPORTED_MODULE_8__.OpenHereSettingsComponent,
        ],
        providers: [
            _oh_opener__WEBPACK_IMPORTED_MODULE_7__.OpenHereOpenerService,
            _oh_boot_service__WEBPACK_IMPORTED_MODULE_6__.OpenHereBootService,
            { provide: tabby_core__WEBPACK_IMPORTED_MODULE_3__.CLIHandler, useClass: _oh_cli_handler__WEBPACK_IMPORTED_MODULE_5__.OpenHereCLIHandler, multi: true },
            { provide: tabby_settings__WEBPACK_IMPORTED_MODULE_4__.SettingsTabProvider, useClass: _oh_settings_component__WEBPACK_IMPORTED_MODULE_8__.OpenHereSettingsTabProvider, multi: true },
        ],
    }),
    __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_2__.Injector])
], OpenHereModule);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OpenHereModule);

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map