export default function(command: string): string[] {
  if (process.platform === 'win32') {
    return ['cmd', '/c', command.replace(/\//g, '\\')]
  } else {
    return ['bash', '-c', command]
  }
}
