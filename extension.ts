import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.fixApostrophes",
    () => {
      // Get the active editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No active editor
      }

      // Get the current selection or the whole document
      const document = editor.document;
      const selection = editor.selection.isEmpty
        ? new vscode.Range(
            0,
            0,
            document.lineCount - 1,
            document.lineAt(document.lineCount - 1).text.length
          )
        : editor.selection;

      // Get the error message to fix
      const errorMessage = document.getText(selection);

      // Replace the special characters
      const replacedMessage = errorMessage
        .replace(/'/g, "&apos;")
        .replace(/‘/g, "&lsquo;")
        .replace(/&#39;/g, "&rsquo;");

      // Apply the fix in the editor
      editor.edit((editBuilder: string) => {
        editBuilder.replace(selection, replacedMessage);
      });
    }
  );

  context.subscriptions.push(disposable);

  vscode.languages.registerCodeActionsProvider(
    { pattern: "**/*.{ts,js}" }, // Specify the file types to apply the quick fix to
    {
      provideCodeActions(
        document: { getText: () => any; positionAt: (arg0: number) => any },
        range: any,
        context: any,
        token: any
      ) {
        const diagnostics: vscode.Diagnostic[] = [];

        // Find the special characters in the document
        const text = document.getText();
        const regex = /['‘’]/g;
        let match;
        while ((match = regex.exec(text))) {
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
            arguments: [document, diagnostic.range],
          };

          fixAction.diagnostics = [diagnostic];
          diagnostics.push(diagnostic);
        }

        return diagnostics;
      },
    }
  );
}

export function deactivate() {}
