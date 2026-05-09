import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('DarakLab Copilot is active!');

    let explainDisposable = vscode.commands.registerCommand('daraklab.explainCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection) || editor.document.getText();
            
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "DarakLab: Analyzing code...",
                cancellable: false
            }, async (progress) => {
                try {
                    const response = await axios.post('http://localhost:8000/chat', {
                        messages: [{ role: 'user', content: `Explain this FPGA/HLS code and suggest improvements:\n\n${text}` }]
                    });
                    
                    const panel = vscode.window.createWebviewPanel(
                        'daraklabResult',
                        'DarakLab Analysis',
                        vscode.ViewColumn.Beside,
                        {}
                    );
                    panel.webview.html = `<html><body><pre>${response.data.message.content}</pre></body></html>`;
                } catch (err) {
                    vscode.window.showErrorMessage("Failed to connect to DarakLab Backend.");
                }
            });
        }
    });

    let optimizeDisposable = vscode.commands.registerCommand('daraklab.optimizeHLS', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const text = editor.document.getText();
            try {
                const response = await axios.post('http://localhost:8000/hls/analyze', { code: text });
                const suggestions = response.data.suggestions;
                
                if (suggestions.length > 0) {
                    const msg = suggestions.map((s: any) => `- ${s.message}`).join('\n');
                    vscode.window.showInformationMessage(`HLS Suggestions:\n${msg}`);
                } else {
                    vscode.window.showInformationMessage("No specific HLS optimizations found.");
                }
            } catch (err) {
                vscode.window.showErrorMessage("Backend unreachable.");
            }
        }
    });

    context.subscriptions.push(explainDisposable, optimizeDisposable);
}

export function deactivate() {}
