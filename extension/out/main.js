"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.fixApostrophes",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const document = editor.document;
      const selection = editor.selection.isEmpty ? new vscode.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      ) : editor.selection;
      const errorMessage = document.getText(selection);
      const replacedMessage = errorMessage.replace(/'/g, "&apos;").replace(/‘/g, "&lsquo;").replace(/&#39;/g, "&rsquo;");
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, replacedMessage);
      });
    }
  );
  context.subscriptions.push(disposable);
  vscode.languages.registerCodeActionsProvider(
    { pattern: "**/*.{ts,js}" },
    // Specify the file types to apply the quick fix to
    {
      provideCodeActions(document, range, context2, token) {
        const diagnostics = [];
        const text = document.getText();
        const regex = /['‘’]/g;
        let match;
        while (match = regex.exec(text)) {
          const diagnostic = new vscode.Diagnostic(
            new vscode.Range(
              document.positionAt(match.index),
              document.positionAt(match.index + match[0].length)
            ),
            "Replace special character",
            vscode.DiagnosticSeverity.Warning
          );
          diagnostic.code = "replace-special-character";
          diagnostic.source = "Quote Replacer";
          const fixAction = new vscode.CodeAction(
            "Fix apostrophes",
            vscode.CodeActionKind.QuickFix
          );
          fixAction.command = {
            command: "extension.fixApostrophes",
            title: "Fix Apostrophes",
            arguments: [document, diagnostic.range]
          };
          fixAction.diagnostics = [diagnostic];
          diagnostics.push(diagnostic);
        }
        return diagnostics;
      }
    }
  );
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=main.js.map
