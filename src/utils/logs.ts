import { colors } from "./terminal.colors";

export class Logger {
    readonly name: string;
    constructor(name: string) {
        this.name = name;

        this.datePrefix = this.datePrefix.bind(this);
        this.log = this.log.bind(this);
        this.debug = this.debug.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
        this.inErr = this.inErr.bind(this);
    }

    datePrefix(prefix='') {
        const date = new Date().toLocaleTimeString('uk-UA');
        return '[' + (prefix ? (prefix + ' ') : '')
            + date + (this.name ? " " + this.name : '') + ']';
    }

    log(...args: any[]) {
        console.log(this.datePrefix(), ...args, colors.reset);
    }
    debug(...args: any[]) {
        if (process.env.DEBUG != 'true') return;
        console.log(colors.cyan + this.datePrefix('DEBUG'), ...args, colors.reset);
    }

    warn(...args: any[]) {
        console.warn(colors.yellow + this.datePrefix('WARN'), ...args, colors.reset);
    }
    error(...args: any[]) {
        console.error(colors.red + this.datePrefix('ERROR'), ...args, colors.reset);
    }
    inErr(...args: any[]) {
        console.error(colors.red + this.datePrefix(), ...args, colors.reset);
    }
}

const globalLogger = new Logger(null as any);

console.log('-----| App starting...', colors.cyan 
    + new Date().toLocaleString(), colors.reset + '|-----');

const logger = {
    create(name: string) {
        return new Logger(name);
    },
    log: globalLogger.log,
    debug: globalLogger.debug,
    warn: globalLogger.warn,
    error: globalLogger.error,
};

(() => {
    const _date = new Date();
    _date.setDate(_date.getDate()+1);
    _date.setSeconds(30);
    _date.setMinutes(0);
    _date.setHours(0);
    function newDateStated(isNewDate = true) {
        const date = new Date();
        let dateStr = colors.reset + (isNewDate ? "New day started" : "This day") + ": ";
        dateStr += colors.green + date.getFullYear() + "-" 
            + (date.getMonth() + 1).toString().padStart(2, '0')
            + "-" + (date.getDate()).toString().padStart(2, '0');
        dateStr += colors.reset + " | " + colors.yellow + date
                .toLocaleDateString('uk-UA', { dateStyle: "long" });

        logger.log(dateStr);
        globalLogger.inErr(dateStr);
    }
    newDateStated(false);
    setTimeout(() => {
        newDateStated();
        setInterval(() => {
            newDateStated()
        }, 24 * 60 * 60 * 1000);
    }, _date.getTime() - Date.now());
})();


export default logger;