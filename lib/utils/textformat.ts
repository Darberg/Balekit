export function bold(text: string): string {
  return `* ${text} *`;
}

export function italic(text: string): string {
  return `_ ${text} _`;
}

export function link(text: string, url: string): string {
  return `[${text}](${url})`;
}

export function preview(text: string, description: string): string {
  return `\`\`\`[${text}]${description}\`\`\``;
}

export class TextFormat {
  text: string;
  constructor(text: string) {
    this.text = text;
  }

  get italic(): string {
    return `_ ${this.text} _`;
  }

  get bold(): string {
    return `* ${this.text} *`;
  }
}
