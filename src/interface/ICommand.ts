

export default interface ICommand {
    desc: string;
    execute: (Array<string>): boolean;
}