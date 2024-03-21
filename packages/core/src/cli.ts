import { start } from '@/commands/start';
import { program } from 'commander';
import { menu } from './commands/menu';

program
  .name('terminal-rush')
  .description('To start, run "npx terminal-rush start"')
  .version('0.0.1')
  .action(menu)

program
  .command('menu')
  .description('Open the menu racing')
  .action(start)

program
  .command('start')
  .description('Start racing')
  .action(start)

program
  .command('multiplayer')
  .description('Start racing')
  .action(() => {
    console.log('Soon...');
  })

program.parse()
