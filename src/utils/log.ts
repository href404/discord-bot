import chalk from "chalk";

export class Logger {
    static info(message: string) {
        const datetime = chalk.grey(`[${new Date().toLocaleString()}]`);
        const level = chalk.bgGreen.whiteBright.bold(" I ");
        console.log(`${datetime} ${level} ${chalk.green(message)}`);
    }

    static verbose(message: string) {
        const datetime = chalk.grey(`[${new Date().toLocaleString()}]`);
        const level = chalk.bgBlue.whiteBright.bold(" D ");
        console.log(`${datetime} ${level} ${chalk.blue(message)}`);
    }

    static error(error: Error) {
        const datetime = chalk.grey(`[${new Date().toLocaleString()}]`);
        const level = chalk.bgRed.whiteBright.bold(" E ");

        if (error.stack === undefined)
            return console.error(`${datetime} ${level} ${chalk.red(error)}`);

        console.error(`${datetime} ${level} ${chalk.red(error.stack)}`);
    }
}