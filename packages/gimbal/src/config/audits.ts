import program, { Command } from 'commander';
import audit from '@/command/audit/program';

const processAudits = (): Promise<void> =>
  audit.run(program.commands.find((cmd: Command): boolean => cmd.name() === 'audit'));

export default processAudits;
