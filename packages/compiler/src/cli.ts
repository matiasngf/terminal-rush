import { Command } from "commander";
import { build, dev } from "./commands-actions";

const program = new Command();

program
  .name("compiler")
  .description("terminal-rush compiler")
  .version("0.0.1")
  .option('-D, --debug', 'output extra debugging')
  .action((options) => {
    const debug = !!options.debug;
    build(debug)
  })

program.command("build")
  .option('-D, --debug', 'output extra debugging')
  .action((options) => {
    const debug = !!options.debug;
    build(debug)
  })

program.command("dev")
  .description("run compiler in development mode")
  .option('-D, --debug', 'output extra debugging')
  .action((options) => {
    const debug = !!options.debug;
    dev(debug)
  })


program.parse(process.argv);
