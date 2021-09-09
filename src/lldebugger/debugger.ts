const DEBUG = (sys.get_engine_info() as { is_debug: boolean }).is_debug;
const LOCAL_LUA_DEBUGGER_FILEPATH = os.getenv("LOCAL_LUA_DEBUGGER_FILEPATH");

if (DEBUG) {
  if (
    LOCAL_LUA_DEBUGGER_FILEPATH !== undefined &&
    LOCAL_LUA_DEBUGGER_FILEPATH !== ""
  ) {
    const [module] = loadfile(LOCAL_LUA_DEBUGGER_FILEPATH);
    //@ts-expect-error package in strict mode
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (module !== undefined) package.loaded["lldebugger"] = module();
  } else {
    //@ts-expect-error package is reserved
    const path = [...package.path.split(";")];
    const debuggerPath = path.filter((path) =>
      path.includes("tomblind.local-lua-debugger")
    )[0];

    if (debuggerPath !== undefined && debuggerPath !== "") {
      const [debuggerModule] = loadfile(
        `${debuggerPath.substr(0, debuggerPath.indexOf("?.lua"))}lldebugger.lua`
      );
      //@ts-expect-error package is reserved
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (debuggerModule) package.loaded["lldebugger"] = debuggerModule();
    }
  }
}

export function start(): void {
  if (DEBUG && os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") == "1") {
    // https://github.com/TypeScriptToLua/TypeScriptToLua/issues/1118
    const dynamicRequire = require;
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const lldebugger = dynamicRequire("lldebugger");
    /**@noSelf */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    lldebugger.start();
  }
}
