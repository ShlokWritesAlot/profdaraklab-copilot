"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
function activate(context) {
    console.log('DarakLab Copilot is active!');
    let explainDisposable = vscode.commands.registerCommand('daraklab.explainCode', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection) || editor.document.getText();
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "DarakLab: Analyzing code...",
                cancellable: false
            }, (progress) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield axios_1.default.post('http://localhost:8000/chat', {
                        messages: [{ role: 'user', content: `Explain this FPGA/HLS code and suggest improvements:\n\n${text}` }]
                    });
                    const panel = vscode.window.createWebviewPanel('daraklabResult', 'DarakLab Analysis', vscode.ViewColumn.Beside, {});
                    panel.webview.html = `<html><body><pre>${response.data.message.content}</pre></body></html>`;
                }
                catch (err) {
                    vscode.window.showErrorMessage("Failed to connect to DarakLab Backend.");
                }
            }));
        }
    }));
    let optimizeDisposable = vscode.commands.registerCommand('daraklab.optimizeHLS', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const text = editor.document.getText();
            try {
                const response = yield axios_1.default.post('http://localhost:8000/hls/analyze', { code: text });
                const suggestions = response.data.suggestions;
                if (suggestions.length > 0) {
                    const msg = suggestions.map((s) => `- ${s.message}`).join('\n');
                    vscode.window.showInformationMessage(`HLS Suggestions:\n${msg}`);
                }
                else {
                    vscode.window.showInformationMessage("No specific HLS optimizations found.");
                }
            }
            catch (err) {
                vscode.window.showErrorMessage("Backend unreachable.");
            }
        }
    }));
    context.subscriptions.push(explainDisposable, optimizeDisposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map