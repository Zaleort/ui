export const exec = (command: string, value: string | undefined = undefined) => document.execCommand(command, false, value);
export const queryCommandState = (command: string) => document.queryCommandState(command);
export const queryCommandValue = (command: string) => document.queryCommandValue(command);
