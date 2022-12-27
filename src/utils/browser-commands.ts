/* eslint-disable */

export async function getAllCommands(): Promise<Command[]> {
  return await chrome.commands.getAll();
}

export interface Command {
  name: string;
  shortcut: string;
  description: string;
}
